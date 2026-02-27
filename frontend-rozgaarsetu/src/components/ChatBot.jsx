import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { MessageCircle, X, Search, ArrowRight } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { t } = useContext(LanguageContext);
    const navigate = useNavigate();

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

        // Simple Keyword Matching Logic
        const keywords = ['plumber', 'painter', 'electrician', 'maid', 'beldar', 'carpenter'];
        const lowerInput = userMsg.toLowerCase();

        let foundCategory = null;
        for (let kw of keywords) {
            if (lowerInput.includes(kw)) {
                foundCategory = kw.toUpperCase();
                break;
            }
        }

        setTimeout(() => {
            if (foundCategory) {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: `${t('chatbot_reply')} ${foundCategory}`
                }]);

                // Redirect after a short delay
                setTimeout(() => {
                    setIsOpen(false);
                    setMessages([]);
                    navigate(`/workers?category=${foundCategory}`);
                }, 1500);

            } else {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: 'I can help you find a Plumber, Painter, Electrician, Maid, Beldar or Carpenter! Please mention one of these trades.'
                }]);
            }
        }, 600);

        setInput('');
    };

    return (
        <>
            {/* FAB Button */}
            <div className="chatbot-fab" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window border">
                    <div className="bg-navy text-white p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <span className="fs-5 me-2">🤖</span>
                            <span className="fw-semibold">{t('chatbot_title')}</span>
                        </div>
                        <X size={20} className="cursor-pointer" onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow-1 p-3 bg-offwhite" style={{ overflowY: 'auto' }}>
                        <div className="d-flex flex-column gap-2 mb-2">
                            <div className="bg-white p-2 rounded-3 shadow-sm align-self-start" style={{ maxWidth: '85%', fontSize: '0.9rem' }}>
                                Hello! Looking for workers? Tell me what you need. (e.g. "I need a plumber")
                            </div>
                        </div>

                        {messages.map((msg, i) => (
                            <div key={i} className={`d-flex flex-column gap-2 mb-2`}>
                                <div
                                    className={`p-2 rounded-3 shadow-sm ${msg.sender === 'user' ? 'bg-orange text-white align-self-end' : 'bg-white align-self-start'}`}
                                    style={{ maxWidth: '85%', fontSize: '0.9rem', backgroundColor: msg.sender === 'user' ? '#FF6B00' : 'white', color: msg.sender === 'user' ? 'white' : 'black' }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-top bg-white">
                        <form onSubmit={handleSend} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder={t('chatbot_placeholder')}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="btn btn-sm btn-primary">
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
