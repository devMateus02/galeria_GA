import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Nav-bar.css';
import Api from "../service/Api";

function NavBar() {
  const dialogRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [logado, setLogado] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const closeMenu = () => setMenuAberto(false);

  const openDialog = () => {
    dialogRef.current?.showModal();
    setTimeout(() => setIsVisible(true), 50);
    closeMenu();
  };

  const closeDialog = () => {
    setIsVisible(false);
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        dialogRef.current?.close();
        setIsClosing(false);
        setNome('');
        setSenha('');
        setErrorMsg('');
        setSuccessMsg('');
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isClosing]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const status = localStorage.getItem('status');
    if (token) {
      setLogado(true);
      if (status === 'adm') setIsAdmin(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await Api.post('http://localhost:3000/login', { nome, senha });
      const data = response.data;

      setSuccessMsg('Login realizado com sucesso!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('status', data.usuario.status);
      localStorage.setItem('nome', data.usuario.nome);
      setLogado(true);
      setIsAdmin(data.usuario.status === 'adm');
      setTimeout(() => closeDialog(), 500);
    } catch (error) {
      if (error.response?.data) {
        setErrorMsg(error.response.data.mensagem || 'Erro no login');
      } else {
        setErrorMsg('Erro na conexão com o servidor');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('status');
    setLogado(false);
    setIsAdmin(false);
    window.location.href = '/';
    closeMenu();
  };

  return (
    <>
      {/* Botão hambúrguer */}
    <button
  onClick={toggleMenu}
  className="lg:hidden fixed top-2 left-3 z-50 bg-blue-900 text-white p-2 rounded"
  aria-label="Toggle menu"
>
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line
      className={`transition-transform duration-300 ease-in-out origin-center ${
        menuAberto ? "translate-y-[4px]  -translate-x-[5px] rotate-45" : "translate-y-0 rotate-0"
      }`}
      x1="3"
      y1="6"
      x2="21"
      y2="6"
    />
    <line
      className={`transition-opacity duration-300 ease-in-out ${
        menuAberto ? "opacity-0" : "opacity-100"
      }`}
      x1="3"
      y1="12"
      x2="21"
      y2="12"
    />
    <line
      className={`transition-transform duration-300 ease-in-out origin-center ${
        menuAberto ? "-translate-y-[5px] -translate-x-[5px] -rotate-45" : "translate-y-0 rotate-0"
      }`}
      x1="3"
      y1="18"
      x2="21"
      y2="18"
    />
  </svg>
</button>


      {/* Menu principal */}
         <nav className={`
  bg-black text-white fixed  lg:sticky top-0 left-0 z-40
  h-screen lg:h-[100vh] w-[80%] sm:w-[250px] max-w-[250px] lg:max-w-[250px]
  flex justify-around flex-col
  transform transition-transform duration-300 ease-in-out
  ${menuAberto ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0 lg:flex lg:flex-col lg:items-center
  border-r-2 border-gray-700
`}>

        <div className="text-center mt-6 flex items-center gap-4 flex-col ">
          <img
            className="w-20 h-20 rounded-full"
            src="GA.jpeg"
            alt="logo GA"
          />
          <h1 className="text-sm sm:text-base lg:text-lg text-center">Galeria de fotos GA</h1>
        </div>

        <ul className="nav flex flex-col  mt-6 gap-4 text-base w-screen max-w-[100%]">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/foto" onClick={closeMenu}>Fotos</Link></li>
          <li><Link to="/info" onClick={closeMenu}>Informações</Link></li>
        </ul>

        {!logado && (
          <button
            onClick={openDialog}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Login
          </button>
        )}

        {logado && (
          <div className="flex flex-col gap-2 items-center mt-4">
            {isAdmin && (
              <Link
                to="/painel"
                onClick={closeMenu}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Painel
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}

        <ul className="list-sociais flex justify-around w-full text-xl">
          <li><a href="https://www.facebook.com/icnvvilaemil?locale=pt_BR" target="_blank" rel="noopener noreferrer">f</a></li>
          <li><a href="https://www.youtube.com/@ICNVvilaemil" target="_blank" rel="noopener noreferrer">y</a></li>
          <li><a href="https://www.instagram.com/gavilaemil" target="_blank" rel="noopener noreferrer">i</a></li>
        </ul>
      </nav>

      {/* Modal de login */}
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[25px] w-[80%] lg:w-[380px] "
        onCancel={(e) => {
          e.preventDefault();
          closeDialog();
        }}
      >
        <div className={`rounded-[25px] shadow-lg w-full max-w-sm p-6 text-left transform transition duration-300 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-center">Login</h2>
            {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
            {successMsg && <p className="text-green-500 text-center">{successMsg}</p>}

            <input
              type="text"
              required
              placeholder="Usuário"
              className="w-full border px-3 py-2 rounded"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Senha"
              className="w-full border px-3 py-2 rounded"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
              <button type="button" onClick={closeDialog} className="text-red-500">Cancelar</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default NavBar;
