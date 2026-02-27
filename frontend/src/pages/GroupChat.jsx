import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LanguageContext';
import { getGroups, getGroupMessages, sendGroupMessage } from '../services/api';

function GroupChat({ user }) {
    const { t } = useLang();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const pollRef = useRef(null);

    // Load groups
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await getGroups(user.id, user.role);
                setGroups(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log('No groups found');
                setGroups([]);
            }
        };
        fetchGroups();
    }, [user.id, user.role]);

    // Load messages when group is selected + poll
    useEffect(() => {
        if (!selectedGroup) return;

        const fetchMessages = async () => {
            try {
                const res = await getGroupMessages(selectedGroup.id);
                setMessages(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log('Could not load messages');
            }
        };

        fetchMessages();

        // Poll every 3 seconds
        pollRef.current = setInterval(fetchMessages, 3000);
        return () => clearInterval(pollRef.current);
    }, [selectedGroup]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedGroup) return;

        try {
            await sendGroupMessage(selectedGroup.id, {
                senderId: user.id,
                senderName: user.name,
                content: newMessage.trim()
            });
            setNewMessage('');
            // Immediately fetch latest messages
            const res = await getGroupMessages(selectedGroup.id);
            setMessages(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log('Failed to send message');
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const d = new Date(timestamp);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-container">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <span>💬</span> {t('groupChats')}
                </div>
                <div className="chat-group-list">
                    {groups.length === 0 ? (
                        <div className="chat-empty" style={{ padding: '2rem 1rem' }}>
                            <div className="chat-empty-icon">👥</div>
                            <p style={{ fontSize: '0.85rem', textAlign: 'center' }}>{t('noGroupsChat')}</p>
                        </div>
                    ) : (
                        groups.map(group => (
                            <div
                                key={group.id}
                                className={`chat-group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                                onClick={() => setSelectedGroup(group)}
                            >
                                <div className="chat-group-avatar">👥</div>
                                <div className="chat-group-info">
                                    <div className="chat-group-name">{group.name}</div>
                                    <div className="chat-group-pincode">📍 {group.pincode || 'N/A'}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Main */}
            <div className="chat-main">
                {!selectedGroup ? (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">💬</div>
                        <h5>{t('selectGroup')}</h5>
                        <p style={{ fontSize: '0.85rem' }}>{t('joinGroupFirst')}</p>
                    </div>
                ) : (
                    <>
                        <div className="chat-header">
                            <div className="chat-group-avatar" style={{ width: 36, height: 36, fontSize: '1rem' }}>👥</div>
                            <div>
                                <div className="chat-header-name">{selectedGroup.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    📍 {selectedGroup.pincode || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.length === 0 ? (
                                <div className="chat-empty">
                                    <div className="chat-empty-icon">💬</div>
                                    <p>{t('noMessages')}</p>
                                    <p style={{ fontSize: '0.85rem' }}>{t('startChatting')}</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div
                                        key={msg.id || i}
                                        className={`chat-msg ${msg.senderId === user.id ? 'sent' : 'received'}`}
                                    >
                                        {msg.senderId !== user.id && (
                                            <div className="chat-msg-sender">{msg.senderName}</div>
                                        )}
                                        <div>{msg.content}</div>
                                        <div className="chat-msg-time">{formatTime(msg.sentAt)}</div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSend}>
                            <input
                                type="text"
                                className="chat-input"
                                placeholder={t('typeMessage')}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
                                ➤
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default GroupChat;
