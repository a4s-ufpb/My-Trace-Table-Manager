import { createHashRouter } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Home from "./routes/Home";
import About from "./routes/About";
import NewExercise from "./routes/Exercices/NewExercise";
import ShownTable from "./routes/TraceTable/ShownTable";
import ExpectedTable from "./routes/TraceTable/ExpectedTable";
import Exercises from "./routes/Exercices";
import ExerciseDetails from "./routes/Exercices/ExerciseDetails";
import NewTheme from "./routes/Themes/NewTheme";
import NewProfessor from "./routes/Professors/NewProfessor";
import HelpPage from "./routes/HelpPage";
import Login from "./routes/Login";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import ErrorPage from "./routes/ErrorPage";

const router = createHashRouter([
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />
    },
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [{
            index: true,
            element: <Home />
        }, {
            path: "about",
            element: <About />
        }, {
            path: "new-exercise",
            element: (
                <RoleProtectedRoute>
                    <NewExercise />
                </RoleProtectedRoute>
            )
        }, {
            path: "showntable",
            element:  (
                <RoleProtectedRoute>
                    <ShownTable />
                </RoleProtectedRoute>
            )
        }, {
            path: "expectedtable",
            element: (
                <RoleProtectedRoute>
                    <ExpectedTable />
                </RoleProtectedRoute>
            )
        }, {
            path: "list-exercises",
            element: (
                <RoleProtectedRoute>
                    <Exercises />
                </RoleProtectedRoute>
            )
        }, {
            path: "exercicio/:id",
            element: (
                <RoleProtectedRoute>
                    <ExerciseDetails />
                </RoleProtectedRoute>
            )
        }, {
            path: "new-theme",
            element: (
                <RoleProtectedRoute>
                    <NewTheme />
                </RoleProtectedRoute>
            )
        }, {
            path: "help-page",
            element: <HelpPage />
        }, {
            path: "new-professor",
            element: (
                <RoleProtectedRoute allowedRoles={["admin"]}>
                    <NewProfessor />
                </RoleProtectedRoute>
            )
        }]
    }
]);

export default router