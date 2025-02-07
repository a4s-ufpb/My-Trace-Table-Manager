import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import "./index.css";
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './routes/Home/index.jsx';
import About from './routes/About/index.jsx';
import NewExercice from './routes/Exercices/NewExercice/index.jsx';
import { TraceTableProvider } from './contexts/TraceTableContext.jsx';
import ShownTable from './routes/TraceTable/ShownTable/index.jsx';
import ExpectedTable from './routes/TraceTable/ExpectedTable/index.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TraceTableProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index path="/" element={<Home />} />
            <Route path="/about" element={<About />}/>
            
            <Route path="/newexercice" element={<NewExercice />} />
            <Route path="/showntable" element={<ShownTable />} />
            <Route path="/expectedtable" element={<ExpectedTable />} />
          </Route>
        </Routes>
      </HashRouter>      
    </TraceTableProvider>
  </StrictMode>,
)
