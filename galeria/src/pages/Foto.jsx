import React, { useEffect, useState } from "react";
import Api from "../service/Api";

function Foto() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [indiceAtual, setIndiceAtual] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const fotosPorPagina = 9;

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await Api.get("/fotos");
        setFotos(response.data);
        setErro(false);
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        setErro(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFotos();
  }, []);

  const abrirModal = (index) => {
    setIndiceAtual(index);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTimeout(() => setIndiceAtual(null), 300);
  };

  useEffect(() => {
    const escFunction = (e) => {
      if (e.key === "Escape") fecharModal();
      if (e.key === "ArrowRight") avancar();
      if (e.key === "ArrowLeft") voltar();
    };
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [indiceAtual]);

  const avancar = () => {
    if (indiceAtual < fotos.length - 1) setIndiceAtual(indiceAtual + 1);
  };

  const voltar = () => {
    if (indiceAtual > 0) setIndiceAtual(indiceAtual - 1);
  };

  // Paginação
  const indexInicial = (paginaAtual - 1) * fotosPorPagina;
  const fotosVisiveis = fotos.slice(indexInicial, indexInicial + fotosPorPagina);
  const totalPaginas = Math.ceil(fotos.length / fotosPorPagina);

  return (
    <div className="p-4 bg-black min-h-screen w-[100vw] text-white relative">
      <h2 className="text-2xl font-bold mb-6 text-center">Galeria de Fotos</h2>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : erro ? (
        <p className="text-center text-red-500 mt-4">
          Erro ao carregar fotos. Tente novamente mais tarde.
        </p>
      ) : (
        <>
          <div className="flex flex-row flex-wrap justify-center gap-2.5">
            {fotosVisiveis.map((foto, index) => {
              const realIndex = indexInicial + index;
              const imagemOtima = foto.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_800/"
              );

              return (
                <div
                  key={realIndex}
                  className="lg:w-[30%] w-[40%] overflow-hidden rounded shadow-md flex flex-col justify-center items-center"
                >
                  <div className="overflow-hidden">
                    <img
                      src={imagemOtima}
                      alt={`Foto ${realIndex + 1}`}
                      loading="lazy"
                      onClick={() => abrirModal(realIndex)}
                      className="cursor-pointer object-cover hover:scale-[1.3] h-[330px] w-[300px] transition-transform duration-[.6s]"
                    />
                  </div>
                  <div className="p-2 text-center border-t">
                    <a
                      href={`${foto.url}?t=${Date.now()}`}
                      download={`foto-${realIndex + 1}.jpg`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition inline-block text-center"
                    >
                      Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex justify-center mt-6 flex-wrap gap-2">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPaginaAtual(i + 1)}
                  className={`w-9 h-9 border border-gray-300 rounded text-white ${
                    paginaAtual === i + 1
                      ? "bg-blue-600 font-bold"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {fotos.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Nenhuma foto enviada ainda.
            </p>
          )}
        </>
      )}

      {/* Modal com carrossel */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300 ${
          modalAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative max-w-[90vw] max-h-[90vh] p-4 flex flex-col items-center">
          <button
            onClick={fecharModal}
            className="absolute top-4 right-4 text-white text-3xl hover:text-red-400"
          >
            &times;
          </button>

          {indiceAtual !== null && (
            <>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={voltar}
                  disabled={indiceAtual === 0}
                  className="text-4xl px-2 hover:text-blue-400"
                >
                  &#8592;
                </button>

                <img
                  src={fotos[indiceAtual].url}
                  alt={`Imagem ampliada ${indiceAtual + 1}`}
                  className="max-h-[80vh] max-w-[90vw] object-contain"
                />

                <button
                  onClick={avancar}
                  disabled={indiceAtual === fotos.length - 1}
                  className="text-4xl px-2 hover:text-blue-400"
                >
                  &#8594;
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="mb-2 text-sm text-gray-300">
                  Foto {indiceAtual + 1} de {fotos.length}
                </p>
                <a
                  href={`${fotos[indiceAtual].url}?t=${Date.now()}`}
                  download={`foto-${indiceAtual + 1}.jpg`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block text-center"
                >
                  Download
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Foto;
