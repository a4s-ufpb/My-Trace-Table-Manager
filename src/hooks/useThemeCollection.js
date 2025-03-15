import { useState } from "react"

export default function useThemeCollection(){
    const [themes, setThemes] = useState(() => {
        const storedThemes = localStorage.getItem("themes") 
        if (!storedThemes) return []
        return JSON.parse(storedThemes)
      })
      
      const addTheme = (theme) => {
        const lastId = themes.length > 0 ? themes[themes.length - 1].id : 0;
        const newTheme = { id: lastId + 1, name: theme };

        const updatedThemes = [...themes, newTheme];

        localStorage.setItem("themes", JSON.stringify(updatedThemes));

        setThemes(updatedThemes);
        console.log("Temas salvos:", updatedThemes);
      }
    
      const removeTheme = (id) => {
        setThemes(state => {
          const newState = state.filter(theme => theme.id !== id)
          localStorage.setItem("themes", JSON.stringify(newState))
          return newState
        })
      }

      return {themes, addTheme, removeTheme}
}