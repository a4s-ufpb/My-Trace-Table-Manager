import ListExercises from "../../components/ListExercises";
import useTraceTableCollection from "../../hooks/useTraceTableCollection";

export default function Exercises() {

    const { traceTables } = useTraceTableCollection();

    return (
        <div className="background">
            <ListExercises exercises={traceTables} />
        </div>
    );

}