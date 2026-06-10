import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPaperPlane, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminSupportPage.css";

const AdminSupportPage = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [reply, setReply] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchChats();
        const interval = setInterval(() => {
            const token = localStorage.getItem("token");
            fetch(`${API_BASE_URL}/support/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setChats(data);
                })
                .catch(err => console.error("Failed to fetch chats", err));
        }, 4000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeChat && chats.length > 0) {
            const updated = chats.find(c => c._id === activeChat._id);
            if (updated) {
                if (JSON.stringify(updated.messages) !== JSON.stringify(activeChat.messages)) {
                    setActiveChat(updated);
                }
                if (updated.unreadByAdmin) {
                    const token = localStorage.getItem("token");
                    fetch(`${API_BASE_URL}/support/${activeChat._id}/read`, {
                        method: "PUT",
                        headers: { 
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}` 
                        },
                        body: JSON.stringify({ role: "admin" })
                    })
                    .then(() => {
                        setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, unreadByAdmin: false } : c));
                    })
                    .catch(err => console.error("Failed to mark chat as read", err));
                }
            }
        }
    }, [chats, activeChat]);

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/support/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setChats(data);
        } catch (err) {
            console.error("Failed to fetch chats");
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim() && !image) return;

        const formData = new FormData();
        formData.append("sender", "admin");
        formData.append("text", reply);
        if (image) formData.append("image", image);

        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE_URL}/support/${activeChat._id}/message`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }, // Form data, no content-type
                body: formData
            });

            setReply("");
            setImage(null);
            setPreview(null);
            fetchChats();

            // Optimistic update or refetch
            const res = await fetch(`${API_BASE_URL}/support/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setChats(data);
            setActiveChat(data.find(c => c._id === activeChat._id));

        } catch (err) {
            alert("Failed to send reply");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSelectChat = async (chat) => {
        setActiveChat(chat);
        if (chat.unreadByAdmin) {
            try {
                const token = localStorage.getItem("token");
                await fetch(`${API_BASE_URL}/support/${chat._id}/read`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}` 
                    },
                    body: JSON.stringify({ role: "admin" })
                });
                setChats(prev => prev.map(c => c._id === chat._id ? { ...c, unreadByAdmin: false } : c));
            } catch (err) {
                console.error("Failed to mark chat as read", err);
            }
        }
    };

    return (
        <div className="admin-support-page chat-mode">
            <button className="back-btn" onClick={() => navigate("/admin")}>
                <FaArrowLeft /> Dashboard
            </button>

            <div className="chat-container">
                {/* SIDEBAR */}
                <div className={`chat-sidebar ${activeChat ? 'mobile-hidden' : ''}`}>
                    <div className="sidebar-header">
                        <h2>Inbox</h2>
                    </div>
                    <div className="chat-list">
                        {chats.map(chat => (
                            <div
                                key={chat._id}
                                className={`chat-item ${activeChat?._id === chat._id ? 'active' : ''}`}
                                onClick={() => handleSelectChat(chat)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '16px' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="chat-avatar user-avatar">
                                        {chat.userName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="chat-info">
                                        <h4 style={{ fontWeight: chat.unreadByAdmin ? '700' : 'normal' }}>{chat.userName || "Anonymous"}</h4>
                                        <p>{chat.subject}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span className="time-ago">
                                        {new Date(chat.lastUpdated).toLocaleDateString()}
                                    </span>
                                    {chat.unreadByAdmin && (
                                        <span className="unread-dot-badge" style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e91e63',
                                            flexShrink: 0
                                        }}></span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN CHAT */}
                <div className={`chat-window ${!activeChat ? 'empty' : ''} ${!activeChat ? 'mobile-hidden' : ''}`}>
                    {!activeChat ? (
                        <div className="no-chat-selected">
                            <h3>Select a conversation to reply</h3>
                        </div>
                    ) : (
                        <>
                            <div className="chat-header">
                                <button className="mobile-back" onClick={() => setActiveChat(null)}>
                                    <FaArrowLeft />
                                </button>
                                <div>
                                    <h3>{activeChat.userName}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeChat.userEmail}</span>
                                </div>
                            </div>

                            <div className="messages-area">
                                {activeChat.messages.map((msg, idx) => (
                                    <div key={idx} className={`message-bubble ${msg.sender}`}>
                                        <div className="message-content">
                                            {msg.text}
                                            {msg.image && <img src={`${API_BASE_URL}${msg.image}`} alt="attachment" />}
                                        </div>
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <form className="chat-input-area" onSubmit={handleSendReply}>
                                <label className="attach-btn">
                                    <FaCloudUploadAlt />
                                    <input type="file" hidden onChange={handleImageChange} />
                                </label>
                                <input
                                    type="text"
                                    placeholder="Type a reply..."
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
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

export default AdminSupportPage;



