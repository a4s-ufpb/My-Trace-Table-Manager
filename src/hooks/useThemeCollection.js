import { useEffect, useState } from "react"

export default function useThemeCollection() {
  const [themes, setThemes] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(5);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/v1";

  const getToken = () => localStorage.getItem('token');
  const getUserId = () => localStorage.getItem('userId');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

    fetch(`${API_URL}/theme/user/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setAllThemes(data.content))
      .catch(error => console.error("Erro ao carregar temas:", error))
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

    fetch(`${API_URL}/theme/user/${userId}?page=${currentPage}&size=${itemsPerPage}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setThemes(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(error => console.error("Erro ao carregar temas:", error))
  }, [currentPage, themes]);

  const addTheme = (name) => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

    const newTheme = { name };

    fetch(`${API_URL}/theme/${userId}`, {
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
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

    fetch(`${API_URL}/theme/${id}/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          setThemes(prevThemes => {
            const updateThemes = prevThemes.filter(theme => theme.id !== id);
            if (updateThemes.length === 0 && currentPage > 0) {
              setCurrentPage(currentPage - 1);
            }
            return updateThemes;
          });
        } else {
          alert("Você não tem permição para remover!");
        }
      })
      .catch(error => console.error("Erro ao remover tema:", error));

  };

  const editTheme = (themeId, themeUpdate) => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

    fetch(`${API_URL}/theme/${themeId}/${userId}`, {
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
      const response = await fetch(`${API_URL}/theme/trace/${traceId}`, {
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

  const changePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  }

  return { themes, allThemes, addTheme, editTheme, getThemesByExercise, removeTheme, currentPage, totalPages, changePage }
}