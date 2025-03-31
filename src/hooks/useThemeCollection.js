import { useEffect, useState } from "react"

export default function useThemeCollection() {
  const [themes, setThemes] = useState([]);

  const getToken = () => localStorage.getItem('token');
  const getUserId = () => localStorage.getItem('userId');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }

    fetch("http://localhost:8080/v1/theme", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setThemes(data.content))
      .catch(error => console.error("Erro ao carregar temas:", error))
  }, []);

  const addTheme = (name) => {
    const token = getToken();
    const userId = getUserId();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }

    const newTheme = { name };

    fetch(`http://localhost:8080/v1/theme/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(newTheme),
    })
      .then(response => response.json())
      .then(data => {
        setThemes(prevThemes => [...prevThemes, data]);
      })
      .catch(error => console.error("Erro ao cadastrar tema:", error));
  };

  const removeTheme = (id) => {
    const token = getToken();
    const userId = getUserId();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }

    fetch(`http://localhost:8080/v1/theme/${id}/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.ok) {
          setThemes(prevThemes => prevThemes.filter(theme => theme.id !== id));
        } else {
          alert("Erro ao remover tema!");
        }
      })
      .catch(error => console.error("Erro ao remover tema:", error));
  };

  return { themes, addTheme, removeTheme }
}