import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaTimes, FaArrowLeft, FaPaperPlane, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CustomerService.css";

const CustomerService = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // New Chat State
    const [showNewChatForm, setShowNewChatForm] = useState(false);
    const [startMessage, setStartMessage] = useState("");

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (user.email) fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch(`http://localhost:5000/support/user/${user.email}`);
            const data = await res.json();
            setChats(data);
        } catch (err) {
            console.error("Failed to fetch chats");
        }
    };

    const handleStartChat = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("userEmail", user.email);
        formData.append("userName", user.name);
        formData.append("message", startMessage);
        if (image) formData.append("image", image);

        try {
            await fetch("http://localhost:5000/support/start", {
                method: "POST",
                body: formData
            });
            setStartMessage("");
            setImage(null);
            setPreview(null);
            setShowNewChatForm(false);
            fetchChats();
        } catch (err) {
            alert("Failed to start chat");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !image) return;

        const formData = new FormData();
        formData.append("sender", "user");
        formData.append("text", newMessage);
        if (image) formData.append("image", image);

        try {
            await fetch(`http://localhost:5000/support/${activeChat._id}/message`, {
                method: "PUT",
                body: formData
            });
            setNewMessage("");
            setImage(null);
            setPreview(null);
            fetchChats(); // Refresh to see new message
            // Ideally we'd just push to local state but this is safer for now
            const updatedChat = { ...activeChat };
            // We'll let the fetchChats handle updating the full list, 
            // but we need to update activeChat to show immediate feedback if possible
            // Re-fetching specific chat or just list is fine.
            // Let's just re-fetch lists and find the active chat again.
            const res = await fetch(`http://localhost:5000/support/user/${user.email}`);
            const data = await res.json();
            setChats(data);
            setActiveChat(data.find(c => c._id === activeChat._id));

        } catch (err) {
            alert("Failed to send message");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="customer-service-page chat-mode">
            <button className="back-btn" onClick={() => navigate("/home")}>
                <FaArrowLeft /> Back
            </button>

            <div className="chat-container">
                {/* SIDEBAR: CHAT LIST */}
                <div className={`chat-sidebar ${activeChat ? 'mobile-hidden' : ''}`}>
                    <div className="sidebar-header">
                        <h2>Support Chats</h2>
                        <button className="new-chat-btn" onClick={() => setShowNewChatForm(true)}>
                            <FaPlus /> New
                        </button>
                    </div>

                    <div className="chat-list">
                        {chats.map(chat => (
                            <div
                                key={chat._id}
                                className={`chat-item ${activeChat?._id === chat._id ? 'active' : ''}`}
                                onClick={() => setActiveChat(chat)}
                            >
                                <div className="chat-avatar">🎧</div>
                                <div className="chat-info">
                                    <h4>{chat.subject}</h4>
                                    <p>{new Date(chat.lastUpdated).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN AREA */}
                <div className={`chat-window ${!activeChat && !showNewChatForm ? 'empty' : ''} ${!activeChat && showNewChatForm ? 'mobile-hidden' : ''}`}>

                    {/* 1. EMPTY STATE */}
                    {!activeChat && !showNewChatForm && (
                        <div className="no-chat-selected">
                            <h3>Select a chat or start a new one</h3>
                        </div>
                    )}

                    {/* 2. NEW CHAT FORM */}
                    {showNewChatForm && (
                        <div className="new-chat-form-container">
                            <h3>Start a New Support Chat</h3>
                            <form onSubmit={handleStartChat}>
                                <textarea
                                    placeholder="How can we help you?"
                                    value={startMessage}
                                    onChange={e => setStartMessage(e.target.value)}
                                    required
                                />
                                <div className="form-actions">
                                    <label className="icon-btn">
                                        <FaCloudUploadAlt />
                                        <input type="file" hidden onChange={handleImageChange} />
                                    </label>
                                    <button type="submit">Start Chat</button>
                                </div>
                                {preview && <img src={preview} className="preview-thumb" alt="upload" />}
                            </form>
                            <button className="cancel-btn" onClick={() => setShowNewChatForm(false)}>Cancel</button>
                        </div>
                    )}

                    {/* 3. ACTIVE CHAT */}
                    {activeChat && (
                        <>
                            <div className="chat-header">
                                <button className="mobile-back" onClick={() => setActiveChat(null)}>
                                    <FaArrowLeft />
                                </button>
                                <h3>{activeChat.subject}</h3>
                            </div>

                            <div className="messages-area">
                                {activeChat.messages.map((msg, idx) => (
                                    <div key={idx} className={`message-bubble ${msg.sender}`}>
                                        <div className="message-content">
                                            {msg.text}
                                            {msg.image && <img src={`http://localhost:5000${msg.image}`} alt="attachment" />}
                                        </div>
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <label className="attach-btn">
                                    <FaCloudUploadAlt />
                                    <input type="file" hidden onChange={handleImageChange} />
                                </label>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="send-btn">
                                    <FaPaperPlane />
                                </button>
                            </form>
                            {preview && (
                                <div className="input-preview">
                                    <img src={preview} alt="preview" />
                                    <FaTimes onClick={() => { setImage(null); setPreview(null) }} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerService;
