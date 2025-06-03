import { Link } from "react-scroll";
import styles from "./styles.module.css";
import HelpSection from "../../components/HelpSection";

import exerciseInitialSettingsImage from "../../assets/help/exercise-initial-settings.png";
import shownTableImage from "../../assets/help/shown-table.png";
import expectedTableImage from "../../assets/help/expected-table.png";
import typeTableImage from "../../assets/help/type-table.png";
import editProfileImage from "../../assets/help/edit-profile.png";
import listExercisesImage from "../../assets/help/list-exercises.png";
import { BsArrowUp } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function HelpPage() {

    const navigate = useNavigate();

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div className="background">
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Tópicos de Ajuda</h2>

                <nav className={styles.summary}>
                    <h2>Sumário</h2>
                    <ol className={styles.summaryList}>
                        <li><Link to="initial-settings" smooth={true} duration={500}>Como preencher as configurações iniciais de um novo exercício</Link></li>
                        <li><Link to="shown-table" smooth={true} duration={500}>Como preencher a tabela mostrada</Link></li>
                        <li><Link to="expected-table" smooth={true} duration={500}>Como preencher a tabela esperada</Link></li>
                        <li><Link to="type-table" smooth={true} duration={500}>Como preencher a tabela de tipos</Link></li>
                        <li><Link to="edit-profile" smooth={true} duration={500}>Como alterar os dados do perfil</Link></li>
                        <li><Link to="role" smooth={true} duration={500}>Tipos de usuário</Link></li>
                        <li><Link to="list-exercises" smooth={true} duration={500}>Visualização de exercícios</Link></li>
                    </ol>
                </nav>

                <div className="btn-container">
                    <button type="button" onClick={() => navigate("/")} className="btn">Voltar</button>
                </div>

                <HelpSection
                    sectionId="initial-settings"
                    title="1. Como preencher as configurações iniciais de um novo exercício"
                    text={
                        <>
                            O professor deve fornecer a imagem do código que o aluno vai utilizar
                            para preencher a trace table. Além disso, é necessário informar a quantidade
                            de variáveis (máximo de 4) e a quantidade de passos (máximo de 10) que serão
                            exibidos na tabela. Também é preciso que o professor defina o(s) tema(s)
                            relacionado(s) ao exercício.
                        </>
                    }
                    images={{ src: exerciseInitialSettingsImage, alt: "Imagem de exemplo de configurações iniciais de exercício" }}
                />

                <HelpSection
                    sectionId="shown-table"
                    title="2. Como preencher a tabela mostrada"
                    text={
                        <>
                            A tabela mostrada será visualizada pelo aluno e deve conter os espaços de edição necessários.
                            O professor deve marcar as células que o aluno pode editar com <strong>?</strong>.
                            Já as células que não podem ser alteradas devem ser preenchidas com <strong>#</strong>.
                        </>
                    }
                    images={{ src: shownTableImage, alt: "Imagem de exemplo de tabela mostrada" }}
                />

                <HelpSection
                    sectionId="expected-table"
                    title="3. Como preencher a tabela esperada"
                    text={
                        <>
                            A tabela esperada deve conter os valores corretos para a atividade. Essa tabela será usada como
                            referência para a correção automática, comparando as respostas do aluno com os resultados esperados.
                        </>
                    }
                    images={{ src: expectedTableImage, alt: "Imagem de exemplo de tabela esperada" }}
                />

                <HelpSection
                    sectionId="type-table"
                    title="4. Como preencher a tabela de tipos"
                    text={
                        <>
                            O professor deve preencher a tabela de tipos com o respectivo tipo de valor esperado em cada célula. Caso opte em não preencher a tabela de tipos, todas as células serão consideradas 'String' por padrão. Posteriormente, qualquer valor de qualquer célula na tabela de tipos poderá ser alterado durante a edição, ainda que não tenha optado em preenchê-la.
                        </>
                    }
                    images={[
                        { src: expectedTableImage, alt: "Imagem de exemplo de tabela esperada" },
                        { src: typeTableImage, alt: "Imagem de exemplo de tabela de tipos" }
                    ]}
                />

                <HelpSection
                    sectionId="edit-profile"
                    title="5. Como alterar os dados do perfil"
                    text={
                        <>
                            O usuário pode alterar o 'Nome', 'Email' e 'Senha' apenas digitando a nova informação desejada em seu respectivo campo e clicando no botão de salvar. A senha atual nunca é exibida, então caso o usuário opte em não realizar nenhuma alteração neste campo, sua senha permanecerá a mesma.
                        </>
                    }
                    images={{ src: editProfileImage, alt: "Imagem de exemplo de edição de perfil" }}
                />

                <HelpSection
                    sectionId="role"
                    title="6. Tipos de usuário"
                    text={
                        <>
                            O sistema possui dois tipos de usuários: <strong>Usuário Padrão</strong> e <strong>Administrador</strong>. O Usuário Padrão pode criar, editar e visualizar seus exercícios, pode também criar temas e editar seu perfil. Já o Administrador tem acesso a todas as funcionalidades do Usuário Padrão, além de poder gerenciar todos os usuários.
                        </>
                    }
                />

                <HelpSection
                    sectionId="list-exercises"
                    title="6. Visualização de exercícios"
                    text={
                        <>
                            O professor pode visualizar todos os seus exercícios organizados por temas, facilitando a busca. Além disso, é possível apagar exercícios que não são mais necessários e realizar outras ações de gerenciamento ao clicar em "ver" no exercício desejado.
                        </>
                    }
                    images={{ src: listExercisesImage, alt: "Imagem de exemplo de lista de exercícios" }}
                />
            </div>

            <button onClick={scrollToTop} className={styles.scrollToTop}>
                <BsArrowUp />
            </button>
        </div>
    )
}
