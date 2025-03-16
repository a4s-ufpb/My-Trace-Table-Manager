import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import "./index.css";
import "./styles/globals.css"
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './routes/Home/index.jsx';
import About from './routes/About/index.jsx';
import NewExercice from './routes/Exercices/NewExercice/index.jsx';
import { TraceTableProvider } from './contexts/TraceTableContext.jsx';
import ShownTable from './routes/TraceTable/ShownTable/index.jsx';
import ExpectedTable from './routes/TraceTable/ExpectedTable/index.jsx';
import NewTheme from './routes/Themes/NewTheme/index.jsx';
import HelpPage from './routes/HelpPage/index.jsx';
import NewProfessor from './routes/Professors/NewProfessor/index.jsx';
import ExerciseDetails from './components/ExerciseDetails/index.jsx';
import Exercices from './routes/Exercices/index.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TraceTableProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index path="/" element={<Home />} />
            <Route path="/about" element={<About />}/>
            
            <Route path="/new-exercice" element={<NewExercice />} />
            <Route path="/showntable" element={<ShownTable />} />
            <Route path="/expectedtable" element={<ExpectedTable />} />
            <Route path="/list-exercices" element={<Exercices />} />
            <Route path="/new-theme" element={<NewTheme />} />
            <Route path="/help-page" element={<HelpPage />} />
            <Route path="/new-professor" element={<NewProfessor />} />
            <Route path="/exercicio/:id" element={<ExerciseDetails />} />
          </Route>
        </Routes>
      </HashRouter>      
    </TraceTableProvider>
  </StrictMode>,
)
