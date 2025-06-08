import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css"

export default function ({ setMenu }) {
    const menuRef = useRef(null);
    const role = localStorage.getItem("userRole") || "user";

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
                <Link to="profile" onClick={() => setMenu(false)}>Perfil</Link>
                {role === "admin" &&
                    <Link to="new-professor" onClick={() => setMenu(false)}>Cadastrar/Ver Professor(es)</Link>
                }
                <Link to="new-exercise" onClick={() => setMenu(false)}>Cadastrar Exercício</Link>
                <Link to="list-exercises" onClick={() => setMenu(false)}>Ver Exercícios</Link>
                <Link to="new-theme" onClick={() => setMenu(false)}>Cadastrar/Ver Tema(s)</Link>
                <Link to="help-page" onClick={() => setMenu(false)}>Ajuda</Link>
                <Link to="about" onClick={() => setMenu(false)}>Sobre</Link>
            </div>
        </div>
    );
}