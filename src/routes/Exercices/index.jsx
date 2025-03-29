import ListExercises from "../../components/ListExercises";
import useTraceTableCollection from "../../hooks/useTraceTableCollection";

export default function Exercises() {

    const { traceTables, removeTraceTable } = useTraceTableCollection();

    return (
        <div className="background">
            <ListExercises 
                exercises={traceTables}
                removeExercise={removeTraceTable}
            />
        </div>
    );

}