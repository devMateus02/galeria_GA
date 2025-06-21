import React, { useEffect, useState } from "react";
import Api from "../service/Api";

function Foto() {
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await Api.get("/fotos");
        setFotos(response.data);
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
      }
    };

    fetchFotos();
  }, []);

  const handleDownload = async (url, nome = "imagem.jpg") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nome;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Erro ao fazer o download:", error);
    }
  };

  return (
    <div className="p-4 bg-black">
      <h2 className="text-2xl font-bold mb-6 text-center">Galeria de Fotos</h2>

      <div className="flex flex-row flex-wrap justify-center gap-2.5">
        {fotos.map((foto, index) => (
          <div key={index} className="lg:w-[30%] w-[40%] overflow-hidden rounded shadow-md">
            <div className=" overflow-hidden">
              <img
              src={foto.url}
              alt={`Foto ${index + 1}`}
              className="  object-cover hover:scale-[1.5] transition-transform duration-[.6s]"
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
        ))}
      </div>

      {fotos.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Nenhuma foto enviada ainda.</p>
      )}
    </div>
  );
}

export default Foto;
