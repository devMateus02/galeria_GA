import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Foto from './pages/Foto.jsx';
import Info from './pages/Info.jsx';
import PainelAdm from './pages/Painel.jsx';
import NavBar from './components/Nav-bar.jsx';
import './App.css'

function App() {
  
  return (
  <>
 <div className="flex flex-col lg:flex-row relative ">
  <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/foto" element={<Foto />} />
      <Route path="/info" element={<Info />} />
      <Route path="/painel" element={<PainelAdm />} />
    </Routes>
</div>
<footer className='bg-black border-t-1 border-[rgba(255,255,255,.1)]'>
  <p className='text-[.8em] font-medium '>
    © Copyright 2025 . criado por <a className='underline font-semibold text-white' href="https://mateuscelestinoportifolio.vercel.app/">Mateus celestino</a>
    </p>
  </footer>
</>)
}

export default App;
