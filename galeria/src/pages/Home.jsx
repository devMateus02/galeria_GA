import { useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import './Home.css'

function Home() {
  const frase = 'Boas vindas, a galeria GA!!'
      const [typedPhrase, setTypedPhrase] = useState("")
      const [index, setIndex] = useState(0)
 
      useEffect (() => {
        if (index < frase.length) {
          const timeOut = setTimeout(() => {
            setTypedPhrase((prev)=> prev + frase.charAt(index))
            setIndex((prev) => prev + 1) 
          }, 80);

        return () => clearTimeout(timeOut);

        }

      },[index, frase])
      
      return (
        <>
            <main className="flex justify-center items-center bg-[url('/azul.jpg')] bg-cover bg-center min-h-[100vh] w-[100vw] ">
                  <div>
                    <h1 className='m-0 text-5xl font-semibold mb-3' style={{ textShadow: '5px 3px rgba(0, 0, 0, 0.7)' }}>{typedPhrase}</h1>
                  <Link className='text-[1.2em] hover:font-semibold' style={{ textShadow:'2px 2px rgba(0, 0, 0, 0.7)' }} to="/foto">Ver mais</Link>
                  </div>
            </main>
            
        </>
      )
    }


export default Home
