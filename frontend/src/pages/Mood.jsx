import { useEffect, useState } from "react";
import api from "../services/api";


function Mood() {

    const [mood, setMood] = useState(5);
    const [note, setNote] = useState("");

    const [moods, setMoods] = useState([]);
    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    async function loadMoodData() {

        try {

            setLoading(true);

            const [
                historyResponse,
                summaryResponse
            ] = await Promise.all([
                api.get("/mood"),
                api.get("/mood/summary")
            ]);


            setMoods(
                historyResponse.data.moods || []
            );

            setSummary(
                summaryResponse.data.summary || null
            );

        } catch (error) {

            console.error(error);

            setError(
                "Failed to load mood data"
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadMoodData();

    }, []);


    async function handleSubmit(e) {

        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");


        try {

            await api.post(
                "/mood",
                {
                    moodScore: Number(mood),
                    note: note || null
                }
            );


            setMessage(
                "Mood recorded successfully."
            );

            setNote("");

            await loadMoodData();


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save mood"
            );

        } finally {

            setSaving(false);
        }
    }


    return (

        <div style={{
            maxWidth: "900px",
            margin: "40px auto",
            padding: "20px"
        }}>

            <h1>MindGrid Mood Tracker</h1>

            <p>
                Track how you're feeling over time.
            </p>


            {message && (
                <p>{message}</p>
            )}


            {error && (
                <p>{error}</p>
            )}


            <section>

                <h2>
                    How are you feeling today?
                </h2>


                <form onSubmit={handleSubmit}>

                    <label>
                        Mood score: {mood}/10
                    </label>

                    <br />

                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={mood}
                        onChange={(e) =>
                            setMood(e.target.value)
                        }
                    />

                    <br />
                    <br />


                    <textarea
                        placeholder="Optional note about how you're feeling..."
                        value={note}
                        onChange={(e) =>
                            setNote(e.target.value)
                        }
                        rows="4"
                        style={{
                            width: "100%"
                        }}
                    />


                    <br />
                    <br />


                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Mood"}
                    </button>

                </form>

            </section>


            <hr />


            <section>

                <h2>
                    Mood Summary
                </h2>

                {loading ? (

                    <p>
                        Loading...
                    </p>

                ) : summary ? (

                    <pre>
                        {JSON.stringify(
                            summary,
                            null,
                            2
                        )}
                    </pre>

                ) : (

                    <p>
                        No summary available yet.
                    </p>
                )}

            </section>


            <hr />


            <section>

                <h2>
                    Mood History
                </h2>


                {loading ? (

                    <p>
                        Loading...
                    </p>

                ) : moods.length === 0 ? (

                    <p>
                        No mood entries yet.
                    </p>

                ) : (

                    moods.map((entry) => (

                        <div
                            key={entry.id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "8px"
                            }}
                        >

                            <strong>
                                Mood:{" "}
                                {entry.mood_score}/10
                            </strong>

                            <p>
                                {entry.note || "No note"}
                            </p>

                            <small>
                                {new Date(
                                    entry.created_at
                                ).toLocaleString()}
                            </small>

                        </div>

                    ))

                )}

            </section>

        </div>
    );
}


export default Mood;