import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleLogin(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );


            const {
                token,
                user
            } = response.data;


            localStorage.setItem(
                "mindgrid_token",
                token
            );

            localStorage.setItem(
                "mindgrid_user",
                JSON.stringify(user)
            );


            if (user.role === "COUNSELOR") {

                navigate("/counselor");

            } else {

                navigate("/dashboard");
            }


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);
        }
    }


    return (
        <div style={{
            maxWidth: "400px",
            margin: "100px auto"
        }}>

            <h1>MindGrid</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <br />
                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

            </form>


            {error && (
                <p>{error}</p>
            )}

        </div>
    );
}


export default Login;