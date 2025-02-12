import DisplaySavedTable from "../../components/DisplaySavedTable";

export default function Exercices() {
    const allExercices = JSON.parse(localStorage.getItem("traceTables")) || [];

    if (allExercices.length === 0) {
        return (
            <div className="background">
                <h3>Nenhum exercício cadastrado</h3>
            </div>
        );
    }

    return (
        <div className="background">
            {allExercices.map((exercice) => (
                <div key={exercice.id}>
                    <h2>Exercício {exercice.id}</h2>

                    {exercice.shownTable?.length > 0 && (
                        <>
                            <h3>Shown Table</h3>
                            <DisplaySavedTable traceTable={exercice} typeTable={exercice.shownTable} />
                        </>
                    )}

                    {exercice.expectedTable?.length > 0 && (
                        <>
                            <h3>Expected Table</h3>
                            <DisplaySavedTable traceTable={exercice} typeTable={exercice.expectedTable} />
                        </>
                    )}
                </div>
            ))}
        </div>
    );

}