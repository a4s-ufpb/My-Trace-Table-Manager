import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { useState } from "react";

export default function App() {
  const [professors, setProfessors] = useState([]);

  return (
    <div className="app">
      <Header />
      <Outlet context={{ professors, setProfessors }}/>
    </div>
  );
}