import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { TraceTableProvider } from "./contexts/TraceTableContext";

export default function App() {
  return (
    <div className="app">
      <TraceTableProvider>
        <RouterProvider router={router} />
      </TraceTableProvider>
    </div>
  );
}