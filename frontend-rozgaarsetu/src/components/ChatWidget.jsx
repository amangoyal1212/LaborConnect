import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const FAQ_QUESTIONS = [
    { label: '💰 How do I get paid?', key: 'payment' },
    { label: '⭐ What is Premium?', key: 'premium' },
    { label: '🏗️ How to hire in bulk?', key: 'bulk' },
    { label: '🪪 Aadhaar Verification?', key: 'aadhar' },
    { label: '📞 Contact Support', key: 'contact' },
];

const RESPONSES = {
    payment: `💰 <b>How Payments Work:</b><br/>When a Client books you, the payment is held securely in our escrow platform. Once you mark the job complete and the Client confirms and rates your work, the money is instantly released to your wallet. You earn <i>only after</i> the Client clicks "Confirm Work & Pay".`,
    premium: `⭐ <b>Premium Worker Benefits:</b><br/>Premium workers get a shiny <b>Verified Premium badge</b> visible to all Clients and Contractors! You'll also rank higher in search results and receive priority access to bulk-hire contracts from Contractors. Upgrade for just <b>₹99/month</b>.`,
    bulk: `🏗️ <b>Bulk Hiring (for Contractors):</b><br/>In the Contractor Dashboard, use the <b>Bulk Hiring</b> panel. Select a Trade, enter the number of workers needed, and your site location — we instantly dispatch the best available workers. A platform fee of <b>₹50 per worker</b> applies.`,
    aadhar: `🪪 <b>Aadhaar Verification:</b><br/>Workers can add their 12-digit Aadhaar number during registration. This enables the <b>Aadhaar Verified badge</b> on your profile, boosting trust with Clients. Your Aadhaar data is encrypted and never shared publicly.`,
    contact: `📞 <b>Contact Support:</b><br/>Need help? Reach our team at:<br/><b>📧 support@rozgaarsetu.com</b><br/><b>📱 1800-ROZGAAR (toll free)</b><br/>Available Monday–Saturday, 9 AM – 6 PM IST.`,
    default: `🤔 I'm not sure about that. Try asking about <b>payment</b>, <b>premium</b>, <b>bulk hiring</b>, <b>Aadhaar</b>, or <b>contact support</b>. You can also click one of the FAQ buttons above!`,
};

const getResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('pay') || lower.includes('earn') || lower.includes('money') || lower.includes('escrow')) return RESPONSES.payment;
    if (lower.includes('premium') || lower.includes('upgrade') || lower.includes('badge')) return RESPONSES.premium;
    if (lower.includes('bulk') || lower.includes('hire') || lower.includes('contractor') || lower.includes('dispatch')) return RESPONSES.bulk;
    if (lower.includes('aadhar') || lower.includes('aadhaar') || lower.includes('verif')) return RESPONSES.aadhar;
    if (lower.includes('contact') || lower.includes('support') || lower.includes('help') || lower.includes('phone')) return RESPONSES.contact;
    return RESPONSES.default;
};

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', html: `👋 Hi! I'm the <b>RozgaarSetu Assistant</b>.<br/>Ask me anything or tap a quick question below.`, id: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const sendMessage = (text) => {
        const userText = text || input.trim();
        if (!userText) return;
        setInput('');

        const userMsg = { from: 'user', html: userText, id: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setTyping(true);

        setTimeout(() => {
            const botMsg = { from: 'bot', html: getResponse(userText), id: Date.now() + 1 };
            setMessages(prev => [...prev, botMsg]);
            setTyping(false);
        }, 750);
    };

    return (
        <>
            {/* ── Floating Action Button ── */}
            <motion.button
                className="chat-widget-fab"
                onClick={() => setOpen((o) => !o)}
                aria-label="Open support chat"
                title="Chat with us"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {open ? <X size={22} /> : <MessageCircle size={22} />}
                {!open && <span className="chat-widget-badge">?</span>}
            </motion.button>

            {/* ── Chat Window ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="chat-widget-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="chat-widget-header">
                            <div className="chat-widget-avatar">RS</div>
                            <div>
                                <div className="fw-bold" style={{ fontSize: '0.9rem' }}>RozgaarSetu Assistant</div>
                                <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>● Online — Quick Support</div>
                            </div>
                            <button className="chat-widget-close-btn" onClick={() => setOpen(false)}><X size={16} /></button>
                        </div>

                        {/* Messages */}
                        <div className="chat-widget-messages">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`chat-bubble ${msg.from === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}
                                    dangerouslySetInnerHTML={{ __html: msg.html }}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            ))}
                            {typing && (
                                <div className="chat-bubble chat-bubble-bot chat-typing">
                                    <span /><span /><span />
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* FAQ Quick Buttons */}
                        <div className="chat-widget-faqs">
                            {FAQ_QUESTIONS.map((q) => (
                                <button key={q.key} className="chat-widget-faq-btn" onClick={() => sendMessage(q.label)}>
                                    {q.label}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="chat-widget-input-row">
                            <input
                                className="chat-widget-input"
                                placeholder="Type a question…"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button className="chat-widget-send" onClick={() => sendMessage()} disabled={!input.trim()}>
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
