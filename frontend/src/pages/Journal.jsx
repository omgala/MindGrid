import { useEffect, useState } from "react";
import api from "../services/api";

function Journal() {
    const [journals, setJournals] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [moodScore, setMoodScore] = useState("");
    const [isPrivate, setIsPrivate] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    async function loadJournals() {
        try {
            setLoading(true);

            const response = await api.get("/journal");

            setJournals(response.data.journals || []);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load journal entries"
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadJournals();
    }, []);


    function resetForm() {
        setTitle("");
        setContent("");
        setMoodScore("");
        setIsPrivate(true);
        setEditingId(null);
    }


    async function handleSubmit(e) {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        const data = {
            title: title || undefined,
            content,
            moodScore: moodScore
                ? Number(moodScore)
                : undefined,
            isPrivate
        };

        try {
            if (editingId) {

                await api.put(
                    `/journal/${editingId}`,
                    data
                );

                setMessage("Journal entry updated.");

            } else {

                await api.post(
                    "/journal",
                    data
                );

                setMessage("Journal entry created.");
            }

            resetForm();

            await loadJournals();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save journal entry"
            );
        } finally {
            setSaving(false);
        }
    }


    function startEditing(entry) {
        setEditingId(entry.id);
        setTitle(entry.title || "");
        setContent(entry.content || "");
        setMoodScore(
            entry.mood_score ?? ""
        );
        setIsPrivate(
            entry.is_private ?? true
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    async function handleDelete(id) {

        const confirmed =
            window.confirm(
                "Delete this journal entry?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setMessage("");

            await api.delete(
                `/journal/${id}`
            );

            setMessage(
                "Journal entry deleted."
            );

            if (editingId === id) {
                resetForm();
            }

            await loadJournals();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete journal entry"
            );
        }
    }


    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "40px auto",
                padding: "20px"
            }}
        >

            <h1>MindGrid Journal</h1>

            <p>
                A private space to reflect on your
                thoughts and feelings.
            </p>


            {message && (
                <div>
                    {message}
                </div>
            )}


            {error && (
                <div>
                    {error}
                </div>
            )}


            <section>

                <h2>
                    {editingId
                        ? "Edit Journal Entry"
                        : "Write in your journal"}
                </h2>


                <form onSubmit={handleSubmit}>

                    <div>
                        <label>
                            Title
                        </label>

                        <br />

                        <input
                            type="text"
                            maxLength="200"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Optional title"
                            style={{
                                width: "100%"
                            }}
                        />
                    </div>


                    <br />


                    <div>
                        <label>
                            How are you feeling?
                        </label>

                        <br />

                        <select
                            value={moodScore}
                            onChange={(e) =>
                                setMoodScore(e.target.value)
                            }
                        >
                            <option value="">
                                Select mood
                            </option>

                            <option value="1">
                                1 - Very low
                            </option>

                            <option value="2">
                                2 - Low
                            </option>

                            <option value="3">
                                3 - Okay
                            </option>

                            <option value="4">
                                4 - Good
                            </option>

                            <option value="5">
                                5 - Very good
                            </option>
                        </select>
                    </div>


                    <br />


                    <div>
                        <label>
                            Journal
                        </label>

                        <br />

                        <textarea
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            placeholder="Write whatever is on your mind..."
                            rows="8"
                            required
                            style={{
                                width: "100%"
                            }}
                        />
                    </div>


                    <br />


                    <label>
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) =>
                                setIsPrivate(
                                    e.target.checked
                                )
                            }
                        />

                        {" "}Keep this journal private
                    </label>


                    <br />
                    <br />


                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Update Entry"
                                : "Save Entry"}
                    </button>


                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                marginLeft: "10px"
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </form>

            </section>


            <hr />


            <section>

                <h2>
                    Your Journal Entries
                </h2>


                {loading ? (

                    <p>
                        Loading...
                    </p>

                ) : journals.length === 0 ? (

                    <p>
                        You haven't written anything yet.
                    </p>

                ) : (

                    journals.map((entry) => (

                        <article
                            key={entry.id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px"
                            }}
                        >

                            <h3>
                                {entry.title ||
                                    "Untitled Entry"}
                            </h3>


                            <p>
                                {entry.content}
                            </p>


                            <small>
                                Mood:{" "}
                                {entry.mood_score ||
                                    "Not recorded"}
                            </small>


                            <br />


                            <small>
                                {new Date(
                                    entry.created_at
                                ).toLocaleString()}
                            </small>


                            <br />
                            <br />


                            <button
                                onClick={() =>
                                    startEditing(entry)
                                }
                            >
                                Edit
                            </button>


                            <button
                                onClick={() =>
                                    handleDelete(entry.id)
                                }
                                style={{
                                    marginLeft: "10px"
                                }}
                            >
                                Delete
                            </button>

                        </article>

                    ))

                )}

            </section>

        </div>
    );
}

export default Journal;