import { useEffect, useState } from "react"

export default function useThemeCollection() {
  const [themes, setThemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(5);

  const getToken = () => localStorage.getItem('token');
  const getUserId = () => localStorage.getItem('userId');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

    fetch(`http://localhost:8080/v1/theme/user/${userId}?page=${currentPage}&size=${itemsPerPage}`, {
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

  const removeTheme = async (id) => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

    try {
      const responseTraceTables = await fetch(`http://localhost:8080/v1/trace/theme/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!responseTraceTables.ok) {
        throw new Error("Erro ao carregar trace tables do tema!");
      }

      const traceTables = await responseTraceTables.json();
      for (const traceTable of traceTables.content) {
        const responseThemes = await fetch(`http://localhost:8080/v1/theme/trace/${traceTable.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!responseThemes.ok) {
          throw new Error("Erro ao carregar temas do exercício!");
        }

        const themes = await responseThemes.json();
        if (themes.content.length === 1) {
          await fetch(`http://localhost:8080/v1/trace/${traceTable.id}/${userId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
        } else {
          const updatedThemes = themes.content.filter(theme => theme.id !== id);
          const updatedTraceTable = {
            exerciseName: traceTable.exerciseName,
            header: traceTable.header,
            shownTraceTable: traceTable.shownTraceTable,
            expectedTraceTable: traceTable.expectedTraceTable,
          };
          const themesIds = updatedThemes.map(theme => theme.id).join(",");

          await fetch(`http://localhost:8080/v1/trace/${traceTable.id}/${userId}?themesIds=${themesIds}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedTraceTable),
          });
        }
      }

      const responseRemoveTheme = await fetch(`http://localhost:8080/v1/theme/${id}/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!responseRemoveTheme.ok) {
        throw new Error("Erro ao remover tema!");
      }

      setThemes(prevThemes => {
        const updatedThemes = prevThemes.filter(theme => theme.id !== id);
        if (updatedThemes.length === 0 && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
        return updatedThemes;
    });
    } catch (error) {
      console.error("Erro ao remover tema:", error);
    }
  };

  const editTheme = (themeId, themeUpdate) => {
    const token = getToken();
    if (!token) {
      alert("Usuário não autenticado!");
      return;
    }
    const userId = getUserId();

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

  const changePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  }

  return { themes, addTheme, editTheme, getThemesByExercise, removeTheme, currentPage, totalPages, changePage }
}