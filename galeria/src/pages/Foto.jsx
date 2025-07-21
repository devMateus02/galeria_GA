import React, { useEffect, useState } from "react";
import Api from "../service/Api";

function Foto() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

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
  const handleDownload = async (url, nome = "imagem.jpg") => {
   try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 3000); 
  } catch (error) {
    console.error("Erro ao fazer o download:", error);
  }
};

  return (
    <div className="p-4 bg-black w-[100vw]">
      <h2 className="text-2xl font-bold mb-6 text-center">Galeria de Fotos</h2>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : erro ? (
        <p className="text-center text-red-500 mt-4">Erro ao carregar fotos. Tente novamente mais tarde.</p>
      ) : (
        <>
          <div className="flex flex-row flex-wrap justify-center gap-2.5">
            {fotos.map((foto, index) => {
              const imagemOtima = foto.url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");

              return (
                <div key={index} className="lg:w-[30%] w-[40%] overflow-hidden rounded shadow-md flex flex-col  justify-center items-center">
                  <div className="overflow-hidden">
                    <img
                      src={imagemOtima}
                      alt={`Foto ${index + 1}`}
                      loading="lazy"
                      className="object-cover hover:scale-[1.3] h-[330px] w-[300px] transition-transform duration-[.6s]"
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
            <p className="text-center text-gray-500 mt-4">Nenhuma foto enviada ainda.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Foto;
