import { Link } from "react-scroll";
import styles from "./styles.module.css";

export default function HelpPage() {
    return (
        <div className="background">
            <div className={styles.wrapper}>
                <h1 className={styles.title}>Tópicos de Ajuda</h1>

                <nav className={styles.summary}>
                    <h2>Sumário</h2>
                    <ol className={styles.summaryList}>
                        <li><Link to="configuracoes-iniciais" smooth={true} duration={500}>Como preencher as configurações iniciais de um novo exercício</Link></li>
                        <li><Link to="tabela-mostrada" smooth={true} duration={500}>Como preencher a tabela mostrada</Link></li>
                        <li><Link to="tabela-esperada" smooth={true} duration={500}>Como preencher a tabela esperada</Link></li>
                        <li><Link to="tabela-tipos" smooth={true} duration={500}>Como preencher a tabela de tipos</Link></li>
                        <li><Link to="alterar-perfil" smooth={true} duration={500}>Como alterar os dados do perfil</Link></li>
                    </ol>
                </nav>

                <div className={styles.content}>
                    <section id="configuracoes-iniciais" className={styles.helpSection}>
                        <h3>1. Como preencher as configurações iniciais de um novo exercício</h3>
                        <p>
                            O professor deve fornecer a imagem do código que o aluno vai utilizar
                            para preencher a trace table. Além disso, é necessário informar a quantidade
                            de variáveis (máximo de 4) e a quantidade de passos (máximo de 10) que serão
                            exibidos na tabela. Também é preciso que o professor defina o(s) tema(s)
                            relacionado(s) ao exercício.
                        </p>
                    </section>

                    <section id="tabela-mostrada" className={styles.helpSection}>
                        <h3>2. Como preencher a tabela mostrada</h3>
                        <p>
                            A tabela mostrada será visualizada pelo aluno e deve conter os espaços de edição necessários.
                            O professor deve marcar as células que o aluno pode editar com <strong>'?'</strong>.
                            Já as células que não podem ser alteradas devem ser preenchidas com <strong>'#'</strong>.
                        </p>
                    </section>

                    <section id="tabela-esperada" className={styles.helpSection}>
                        <h3>3. Como preencher a tabela esperada</h3>
                        <p>
                            A tabela esperada deve conter os valores corretos para a atividade. Essa tabela será usada como
                            referência para a correção automática, comparando as respostas do aluno com os resultados esperados.
                        </p>
                    </section>

                    <section id="tabela-tipos" className={styles.helpSection}>
                        <h3>4. Como preencher a tabela de tipos</h3>
                        <p>
                            O professor deve preencher a tabela de tipos com o respectivo tipo de valor esperado em cada célula. Caso opte em não preencher a tabela de tipos, todas as células serão consideradas 'String' por padrão. Posteriormente, qualquer valor de qualquer célula na tabela de tipos poderá ser alterado durante a edição, ainda que não tenha optado em preenchê-la.
                        </p>
                    </section>

                     <section id="alterar-perfil" className={styles.helpSection}>
                        <h3>5. Como alterar os dados do perfil</h3>
                        <p>
                            O usuário pode alterar o 'Nome', 'Email' e 'Senha' apenas digitando a nova informação desejada em seu respectivo campo e clicando no botão de salvar. A senha atual nunca é exibida, então caso o usuário opte em não realizar nenhuma alteração neste campo, sua senha permanecerá a mesma.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
