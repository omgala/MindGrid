import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);


    useEffect(() => {

        const token =
            localStorage.getItem("mindgrid_token");

        const storedUser =
            localStorage.getItem("mindgrid_user");


        if (!token || !storedUser) {

            navigate("/login");

            return;
        }


        setUser(
            JSON.parse(storedUser)
        );

    }, [navigate]);


    function logout() {

        localStorage.removeItem(
            "mindgrid_token"
        );

        localStorage.removeItem(
            "mindgrid_user"
        );

        navigate("/login");
    }


    if (!user) {
        return <p>Loading...</p>;
    }


    return (

        <div style={{
            minHeight: "100vh",
            padding: "40px"
        }}>

            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>

                <div>

                    <h1>MindGrid</h1>

                    <p>
                        Your private wellbeing space
                    </p>

                </div>


                <button onClick={logout}>
                    Logout
                </button>

            </header>


            <main>

                <section>

                    <h2>
                        Welcome back 👋
                    </h2>

                    <p>
                        {user.email}
                    </p>

                </section>


                <section>

                    <h2>
                        Your Wellbeing
                    </h2>

                    <p>
                        Complete your wellbeing
                        assessment to understand
                        how you're doing.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/assessment")
                        }
                    >
                        Take Assessment
                    </button>

                </section>


                <section>

                    <h2>
                        Quick Actions
                    </h2>


                    <button
                        onClick={() =>
                            navigate("/mood")
                        }
                    >
                        Track Mood
                    </button>


                    <button
                        onClick={() =>
                            navigate("/journal")
                        }
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Open Journal
                    </button>


                    <button
                        onClick={() =>
                            navigate("/appointments")
                        }
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Find Counselor
                    </button>

                </section>


                <section>

                    <h2>
                        Recommendations
                    </h2>

                    <p>
                        Personalized wellbeing
                        recommendations will appear
                        here.
                    </p>

                </section>


                <section>

                    <h2>
                        Upcoming Appointment
                    </h2>

                    <p>
                        No upcoming appointment
                        loaded yet.
                    </p>

                </section>

            </main>

        </div>
    );
}


export default Dashboard;