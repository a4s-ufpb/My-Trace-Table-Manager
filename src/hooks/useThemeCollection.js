import { useEffect, useState } from "react"

export default function useThemeCollection() {
  const [themes, setThemes] = useState([]);

  const getToken = () => localStorage.getItem('token');
  const getUserId = () => localStorage.getItem('userId');

  useEffect(() => {
    const token = getToken();
    const userId = getUserId();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }

    fetch(`http://localhost:8080/v1/theme/user/${userId}`, {
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

  const editTheme = (themeId, themeUpdate) => {
    const token = getToken();
    const userId = getUserId();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }

    fetch(`http://localhost:8080/v1/theme/${themeId}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(themeUpdate),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao editar tema");
        }
        return response.json();
      })
      .then(data => {
        setThemes(prevThemes =>
          prevThemes.map(theme =>
            theme.id === themeId ? data : theme
          )
        );
      })
  }

  const getThemesByExercise = async (traceId) => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return [];
    }

    try {
      const response = await fetch(`http://localhost:8080/v1/theme/trace/${traceId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar temas do exercício!");
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error("Erro ao carregar temas:", error);
      return [];
    }
  }

  return { themes, addTheme, editTheme, getThemesByExercise, removeTheme }
}