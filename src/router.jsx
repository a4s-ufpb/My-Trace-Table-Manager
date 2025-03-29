import { createHashRouter } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Home from "./routes/Home";
import About from "./routes/About";
import NewExercise from "./routes/Exercices/NewExercise";
import ShownTable from "./routes/TraceTable/ShownTable";
import ExpectedTable from "./routes/TraceTable/ExpectedTable";
import Exercises from "./routes/Exercices";
import ExerciseDetails from "./components/ExerciseDetails";
import NewTheme from "./routes/Themes/NewTheme";
import NewProfessor from "./routes/Professors/NewProfessor";
import HelpPage from "./routes/HelpPage";
import Login from "./routes/Login";

const router = createHashRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <RootLayout />,
        children: [{
            index: true,
            element: <Home />
        }, {
            path: "about",
            element: <About />
        }, {
            path: "new-exercise",
            element: <NewExercise />,
        }, {
            path: "showntable",
            element: <ShownTable />
        }, {
            path: "expectedtable",
            element: <ExpectedTable />
        }, {
            path: "list-exercises",
            element: <Exercises />,
        }, {
            path: "exercicio/:id",
            element: <ExerciseDetails />
        }, {
            path: "new-theme",
            element: <NewTheme />
        }, {
            path: "help-page",
            element: <HelpPage />
        }, {
            path: "new-professor",
            element: <NewProfessor />
        }]
    }
]);

export default router