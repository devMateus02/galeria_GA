import React, { useState, useEffect } from "react";
import Api from "../service/Api";

function PainelAdm() {
  const nome = localStorage.getItem('nome') || 'Administrador';
  const token = localStorage.getItem('token');

  const [files, setFiles] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [mostraFotos, setMostraFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  const enviarImagens = async () => {
    if (files.length === 0) return setMensagem('Selecione pelo menos uma imagem.');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('fotos', files[i]);
    }

    try {
      const resposta = await Api.post('/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMensagem(`Upload feito com sucesso! Total: ${resposta.data.urls.length} imagens`);
      carregarFotos(); // recarrega após upload
    } catch (erro) {
      console.error('Erro no upload:', erro);
      if (erro.response) {
        setMensagem(erro.response.data.error || 'Erro ao enviar as imagens');
      } else {
        setMensagem('Erro ao conectar com o servidor');
      }
    }
    setTimeout(() => setMensagem(''), 3000);
  };

  const carregarFotos = async () => {
    try {
      setLoading(true);
      setErro(false);
      const resposta = await Api.get("/fotos");
      setMostraFotos(resposta.data);
    } catch (error) {
      console.error("Erro ao mostrar fotos", error);
      setErro(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFotos();
  }, []);

  const excluirFoto = async (id) => {
    try {
      await Api.delete(`/fotos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMensagem('Imagem excluída com sucesso!');
      carregarFotos();
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      setMensagem('Erro ao excluir imagem');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  const excluirTodasFotos = async () => {
    const confirmar = window.confirm("Tem certeza que deseja excluir TODAS as fotos?");
    if (!confirmar) return;

    try {
      await Api.delete('/fotos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMensagem('Todas as imagens foram excluídas com sucesso!');
      carregarFotos();
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      console.error('Erro ao excluir todas as imagens:', error);
      setMensagem('Erro ao excluir todas as imagens');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  return (
    <>
      <div className="container flex-col min-h-[100vh] bg-black w-[100vw]">
        <h1 className="text-4xl m-[1em]">Seja bem-vindo, Adm {nome}!!</h1>

        <div className="flex flex-col items-baseline gap-4 ml-2.5 ">
          <div className=" flex flex-wrap gap-1.5 items-baseline">
            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
              className="border p-2 w-[300px]"
            />
            <button onClick={enviarImagens} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
              Enviar
            </button>
            <button onClick={excluirTodasFotos} className="bg-red-700 text-white px-4 py-2 rounded mt-4 hover:bg-red-800 cursor-pointer">
              Excluir tudo
            </button>
          </div>

          {mensagem && (
            <div>
              <p className="mt-1 text-green-700 transition-opacity duration-500 opacity-100 animate-fade">
                {mensagem}
              </p>
            </div>
          )}
        </div>

        <div className="fotos flex flex-row flex-wrap justify-center gap-1 p-4">
          {loading ? (
            <div className="flex justify-center items-center w-full h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : erro ? (
            <p className="text-red-500 text-center w-full">Erro ao carregar imagens. Tente novamente mais tarde.</p>
          ) : mostraFotos && mostraFotos.length > 0 ? (
            mostraFotos.map((foto) => {
              const imagemOtima = foto.url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
              return (
                <div key={foto._id} className="relative p-2 rounded shadow w-[48%] lg:w-[30%]">
                  <img src={imagemOtima} alt="Imagem" className="h-[330px] w-[300px] rounded " />
                  <button
                    onClick={() => excluirFoto(foto._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-800 cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">Nenhuma imagem encontrada.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PainelAdm;
