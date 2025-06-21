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
</>)
}

export default App;
