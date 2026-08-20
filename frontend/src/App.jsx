import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Mood from "./pages/Mood";
import Journal from "./pages/Journal";


function CounselorDashboard() {

    return (
        <div>
            <h1>MindGrid Counselor Dashboard</h1>
            <p>Counselor portal.</p>
        </div>
    );
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
                 
                <Route
                    path="/journal"
                    element={<Journal />}
                        />

                <Route
                    path="/mood"
                    element={<Mood />}
                      />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/counselor"
                    element={
                        <CounselorDashboard />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;