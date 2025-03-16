import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css"

export default function({ setMenu }) {
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(ev) {
            if (menuRef.current && !menuRef.current.contains(ev.target)) {
                setMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setMenu])

    return (
        <div ref={menuRef} className={styles.menu}>
            <div className={styles.containerBackBtn}>
                <p className={styles.backBtn} onClick={() => setMenu(false)}> X </p>
            </div>

            <div className={styles.menuItens}>
                <Link to="/" onClick={() => setMenu(false)}>Início</Link>
                <Link to="/new-exercice" onClick={() => setMenu(false)}>Cadastrar Exercício</Link>
                <Link to="/list-exercices" onClick={() => setMenu(false)}>Listar Exercícios</Link>
                <Link to="/about" onClick={() => setMenu(false)}>Sobre</Link>
                <Link to="/help-page" onClick={() => setMenu(false)}>Ajuda</Link>
            </div>
        </div>
    );
}