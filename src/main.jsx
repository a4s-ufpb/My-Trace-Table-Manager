import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/Home/index.jsx'
import About from './routes/About/index.jsx'
import Professor from './routes/Professor/index.jsx';
import Exercices from './routes/Professor/Exercices/index.jsx';
import Lists from './routes/Professor/Exercices/Lists/index.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index path="/" element={<Home />} />
          <Route path="/about" element={<About />}/>
          <Route path="/professor" element={<Professor />} />

          <Route path="/exercices/:professorId" element={<Exercices />} />
          <Route path="/exercices/:professorId/lists" element={<Lists />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
