import { useState, useEffect } from "react";
import './slack.css';

interface Message {
    id: number;
    username: string;
    content: string;
    type: string;
    isImportant: number;
    forLater: number;
    timestamp: string;
}

interface FormData {
    id: number | undefined; // `id` can be a number or undefined
    content: string;
    type: string;
    isImportant: boolean;
    forLater: boolean;
}

function Slack() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [laterMessages, setLaterMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingMessage, setAddingMessage] = useState(false);
    const [formData, setFormData] = useState<FormData>({ id: undefined, content: "", type: "", isImportant: false, forLater: false });
    const [selectedType, setSelectedType] = useState<string>('');
    const [showImportant, setShowImportant] = useState<boolean>(false);

    async function fetchMessages() {
        try {
            const response = await fetch("http://127.0.0.1:8000/slack");
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data: Message[] = await response.json();

            const laterMessages = data.filter((message: Message) => message.forLater === 1);

            const filteredMessages = data.filter((message: Message) => {
                const isForLaterValid = message.forLater === 0; // Only include messages where forLater is false
                const isTypeValid = selectedType ? message.type === selectedType : true; // Filter by type if selected
                const isImportantValid = showImportant ? message.isImportant === 1 : true; // Filter by importance if showImportant is true
                return isForLaterValid && isTypeValid && isImportantValid; // Combine the conditions
            });
            // Sort messages by timestamp in descending order (most recent first)
            const sortedMessages = filteredMessages.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return dateB.getTime() - dateA.getTime();
            });

            setMessages(sortedMessages);
            setLaterMessages(laterMessages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedType, showImportant]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Add a new message
    async function createNewMessage(e: React.FormEvent) {
        e.preventDefault();

        const isEdit = formData.id !== undefined;

        const url = isEdit
            ? `http://127.0.0.1:8000/slack/${formData.id}` // Use the message ID for the PUT request
            : "http://127.0.0.1:8000/slack/new";
        const method = isEdit ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: "KimberGonzalez",
                    content: formData.content,
                    type: formData.type,
                    isImportant: formData.isImportant ? 1 : 0,
                    forLater: formData.forLater ? 1 : 0,
                    timestamp: new Date().toISOString(),
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to create message.");
            }

            setFormData({ id: undefined, content: "", type: "", isImportant: false, forLater: false });
            setAddingMessage(false);
            await fetchMessages();
        } catch (err) {
            console.error("Error creating message:", err);
        }
    }

    // Cancel message creation
    function cancelMessageCreation() {
        setFormData({ id: undefined, content: "", type: "", isImportant: false, forLater: false });
        setAddingMessage(false); // Close the form
    }

    // For editing saved for later messages
    function editMessage(message: Message) {
        setFormData({
            id: message.id,
            content: message.content,
            type: message.type,
            isImportant: Boolean(message.isImportant),
            forLater: Boolean(message.forLater)
        });

        setAddingMessage(true); // Show the overlay
    }

    // Delete a message
    async function deleteMessage(id: number) {
        try {
            await fetch(`http://127.0.0.1:8000/slack/${id}`, {
                method: "DELETE",
            });
            await fetchMessages();
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    }

    return (
        <div className="slack">
            <div className="slack-link">
                <h1>Link to:&nbsp;
                    <a
                        href="https://appdevclubumd.slack.com/archives/C07N90NM3AA"
                        target="_blank"
                        rel="noopener noreferrer"
                    > Slack</a>
                </h1>
            </div>
            <div className="later-messages-container">
                <div className="message-feed">
                    <h1>Saved for Later Messages</h1>
                    {laterMessages.map((message) => (
                        <div key={message.id} className="message-container">
                            <div
                                onClick={() => deleteMessage(message.id)}
                                className="delete-message"
                            >
                                x
                            </div>
                            <div className="message-content">
                                <p><strong>{message.username}</strong>: {message.content}</p>
                                <p>Type: {message.type}</p>
                                <button onClick={() => editMessage(message)}>Edit/Send</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="slack-messages-container">
                <h1>Active Messages</h1>
                <div className="filter-container">
                    <label className="filter">Filter by Type:
                        <select
                            id="message-type"
                            value={selectedType}
                            className="dropdown"
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="HW">HW</option>
                            <option value="Lecture">Lecture</option>
                            <option value="Event">Event</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <label className="filter">
                        Only Show Important:
                        <input
                            type="checkbox"
                            checked={showImportant}
                            onChange={(e) => setShowImportant(e.target.checked)}
                        />
                    </label>
                </div>
                <div className="message-feed">
                    {messages.map((message) => (
                        <div key={message.id} className={`message-container ${message.isImportant ? 'important' : ''}`} >
                            <div
                                onClick={() => deleteMessage(message.id)}
                                className="delete-message"
                            >
                                x
                            </div>
                            <div className="message-content">
                                <p><strong>{message.username}</strong>: {message.content}</p>
                                <p>Type: {message.type}</p>
                                <p>{new Date(message.timestamp).toLocaleString()}</p>
                                <button onClick={() => editMessage(message)}>Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {!addingMessage && (
                <div onClick={() => setAddingMessage(!addingMessage)} className="add-message">
                    +
                </div>
            )}

            {addingMessage && (
                <div className="overlay">
                    <div onClick={() => setAddingMessage(!addingMessage)} className="close">
                        x
                    </div>
                    <div className="form">
                        <h2>Add a new message</h2>
                        <form onSubmit={createNewMessage}>
                            <textarea
                                placeholder="Enter your message..."
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                value={formData.content}
                            />
                            <select className="dropdown"
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value })
                                }
                                value={formData.type}
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="HW">HW</option>
                                <option value="Lecture">Lecture</option>
                                <option value="Event">Event</option>
                                <option value="Other">Other</option>
                            </select>
                            <label>
                                Important:
                                <input
                                    type="checkbox"
                                    checked={formData.isImportant}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isImportant: e.target.checked })
                                    }
                                />
                            </label>
                            <label>
                                Save for Later:
                                <input
                                    type="checkbox"
                                    checked={formData.forLater}
                                    onChange={(e) =>
                                        setFormData({ ...formData, forLater: e.target.checked })
                                    }
                                />
                            </label>
                            <button type="submit" className="create-msg-btn">Create</button>
                            <button type="button" onClick={cancelMessageCreation} className="cancel-button">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Slack;
