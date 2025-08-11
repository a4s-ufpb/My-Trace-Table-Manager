import { useEffect, useRef, useState } from "react";
import { BsPersonFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom"
import Menu from "../Menu";
import styles from "./styles.module.css"
import AttentionPopUp from "../AttentionPopUp";
import logoA4S from "/logo-a4s.webp";
import { BiMenu } from "react-icons/bi";

export default function Header() {
    const navigate = useNavigate();

    const [menu, setMenu] = useState(false);
    const [openLogoutPopUp, setOpenLogoutPopUp] = useState(false);
    const [openPersonOptions, setOpenPersonOptions] = useState(false);

    const personOptionsRef = useRef(null);
    const personIconRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(ev) {
            if (personOptionsRef.current &&
                personIconRef.current &&
                !personOptionsRef.current.contains(ev.target) &&
                !personIconRef.current.contains(ev.target)) {
                setOpenPersonOptions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className={styles.header}>

            <BiMenu className={styles.btnMenu} onClick={() => setMenu(true)} />

            <h1 onClick={() => navigate("/")}>My Trace Table Manager</h1>

            <div
                ref={personIconRef}
                className={styles.rightOptionsContainer}
            >
                <BsPersonFill
                    className={styles.btnPerson}
                    onClick={() => {
                        setOpenPersonOptions(prev => !prev);
                    }}
                />
                <img
                    src={logoA4S}
                    alt="logo-a4s"
                    onClick={() => window.open("https://a4s.dev.br", "_blank")}
                />
            </div>

            {openPersonOptions &&
                <div
                    ref={personOptionsRef}
                    className={`${styles.personOptions} ${openPersonOptions ? styles.active : ''}`}
                >
                    <p className={styles.personOption} onClick={() => {
                        setOpenPersonOptions(false);
                        navigate("profile");
                    }}>Perfil</p>
                    <p className={styles.personOption} onClick={() => {
                        setOpenPersonOptions(false);
                        setOpenLogoutPopUp(true);
                    }}>Sair</p>
                </div>
            }
            {menu && <Menu setMenu={setMenu} />}
            {openLogoutPopUp &&
                <AttentionPopUp
                    text="Tem certeza que deseja sair?"
                    confirmAction={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("tokenExpiration")
                        localStorage.removeItem("userId")
                        localStorage.removeItem("userRole")
                        navigate("/login")
                    }}
                    cancelAction={() => setOpenLogoutPopUp(false)}
                />
            }
        </header>
    )
}