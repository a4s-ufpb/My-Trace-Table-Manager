import { useState } from "react";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom"
import logoA4S from "../../assets/logo-a4s.webp"
import Menu from "../Menu";
import styles from "./styles.module.css"

export default function Header() {
    const navigate = useNavigate();

    const [menu, setMenu] = useState(false);
    return (
        <header className={styles.header}>
            <BsGrid3X3GapFill onClick={() => setMenu(true)} />
            <h1 onClick={() => navigate("/")}>My Trace Table Manager</h1>
            <img src={logoA4S} alt="logo-a4s" onClick={() => navigate("/")} />

            {menu && <Menu setMenu={setMenu}/>}
        </header>
    )
}