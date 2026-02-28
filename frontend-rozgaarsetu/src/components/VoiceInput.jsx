import React, { useState, useEffect } from 'react';
import { Mic, X } from 'lucide-react';

const VoiceInput = ({ onSearch, placeholder, value, onChange }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = false;
                rec.interimResults = false;
                rec.lang = 'hi-IN'; // Works well for mixed Hindi/English

                rec.onstart = () => setIsListening(true);

                rec.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (onChange) onChange(transcript);
                    if (onSearch) onSearch(transcript);
                };

                rec.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                };

                rec.onend = () => setIsListening(false);

                setRecognition(rec);
            }
        }
    }, [onSearch, onChange]);

    const toggleListening = () => {
        if (!recognition) return;
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    return (
        <div className="d-flex gap-2 align-items-center w-100 position-relative">
            <div className="input-group flex-grow-1 shadow-sm hover-shadow-md transition-all position-relative bg-white rounded">
                <input
                    type="text"
                    className="form-control border-0 pe-5 py-2 text-charcoal bg-transparent"
                    placeholder={placeholder || "Search workers..."}
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    style={{ borderRadius: 'var(--radius-sm)' }}
                />

                {value && (
                    <button
                        className="btn position-absolute border-0 bg-transparent text-muted"
                        style={{ right: recognition ? '40px' : '5px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                        onClick={() => {
                            if (onChange) onChange('');
                            if (onSearch) onSearch('');
                        }}
                    >
                        <X size={16} />
                    </button>
                )}

                {recognition && (
                    <button
                        className={`btn position-absolute border-0 bg-transparent ${isListening ? 'text-orange animate-pulse' : 'text-muted'}`}
                        style={{ right: '5px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, transition: 'all 0.3s ease' }}
                        onClick={toggleListening}
                        title="Voice Search"
                    >
                        <Mic size={18} />
                    </button>
                )}
            </div>

            {isListening && (
                <div className="position-absolute" style={{ top: '100%', right: '10px', marginTop: '4px', zIndex: 20 }}>
                    <span className="badge rounded-pill shadow-sm animate-fade-in" style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.75rem' }}>
                        सुन रहा है...
                    </span>
                </div>
            )}
        </div>
    );
};

export default VoiceInput;
