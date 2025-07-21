import React, { useEffect, useState } from "react";
import Api from "../service/Api";

function Foto() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [fotoAtual, setFotoAtual] = useState(null);

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

  const abrirModal = (foto) => {
    setFotoAtual(foto);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setFotoAtual(null);
  };

  const handleDownload = (url, nome = "imagem.jpg") => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nome);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fecha modal com ESC
  useEffect(() => {
    const escFunction = (e) => {
      if (e.key === "Escape") fecharModal();
    };
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, []);

  return (
    <div className="p-4 bg-black min-h-screen w-[100vw] text-white">
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
            {fotos.map((foto, index) => {
              const imagemOtima = foto.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_800/"
              );

              return (
                <div
                  key={index}
                  className="lg:w-[30%] w-[40%] overflow-hidden rounded shadow-md flex flex-col justify-center items-center"
                >
                  <div className="overflow-hidden">
                    <img
                      src={imagemOtima}
                      alt={`Foto ${index + 1}`}
                      loading="lazy"
                      onClick={() => abrirModal(foto)}
                      className="cursor-pointer object-cover hover:scale-[1.3] h-[330px] w-[300px] transition-transform duration-[.6s]"
                    />
                  </div>
                  <div className="p-2 text-center border-t">
                    <button
                      onClick={() => handleDownload(foto.url, `foto-${index + 1}.jpg`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {fotos.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              Nenhuma foto enviada ainda.
            </p>
          )}
        </>
      )}

      {/* Modal */}
      {modalAberto && fotoAtual && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-[90vw] max-h-[90vh] p-4 flex flex-col items-center">
            <button
              onClick={fecharModal}
              className="absolute top-4 right-4 text-white text-3xl hover:text-red-400"
            >
              &times;
            </button>

            <img
              src={fotoAtual.url}
              alt="Imagem ampliada"
              className="max-h-[80vh] max-w-[90vw] object-contain mb-4"
            />

            <button
              onClick={() => handleDownload(fotoAtual.url, "foto.jpg")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Foto;

