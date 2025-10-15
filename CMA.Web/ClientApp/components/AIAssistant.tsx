import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal.js';
import { ChatMessage } from '../types.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    context?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, context }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAiReady, setIsAiReady] = useState(false);
    const [retryAfter, setRetryAfter] = useState<number | null>(null);
    const chatRef = useRef<any | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const initializeAi = async () => {
                const apiKey = "AIzaSyB3ZU7PI1I950fCzQfVcWncoifz-z9SHzk"; // Directly using the key for testing
                if (!apiKey) {
                    setError("API_KEY is not configured. The AI assistant is disabled.");
                    setIsAiReady(false);
                    return;
                }
                try {
                    setIsAiReady(false);
                    const knowledgeBase = localStorage.getItem('cmaKnowledgeBase') || '';
                    const systemInstruction = `You are a helpful AI assistant for the FMAA & CMA Admin Dashboard. You are an expert in financial and managerial accounting topics. Your purpose is to help administrators create and manage exam content, analyze student performance data, and answer questions related to the FMAA (Financial and Managerial Accounting Associate) and CMA (Certified Management Accountant) certifications. When the user provides specific context with their question, you must strictly base your answer on that context. If the answer cannot be found in the context, you must state that the provided material does not contain the answer. Be concise and professional.
                    
                    Here is the knowledge base you should use as a primary reference:
                    --- KNOWLEDGE BASE ---
                    ${knowledgeBase}
                    --- END KNOWLEDGE BASE ---
                    `;

                    const ai = new GoogleGenerativeAI(apiKey);
                    // Using a model that is known to be available in v1beta
                    const model = ai.getGenerativeModel({ model: "gemini-pro-latest", systemInstruction });
                    const chat = model.startChat();
                    chatRef.current = chat;
                    
                    let initialMessage = 'Hello! I am your FMAA & CMA specialist assistant. How can I help you with the exam content or data analysis today?';
                    if (context) {
                        const topicTitle = context.split('\n')[0].replace('## ', '');
                        initialMessage = `I see you're looking at material related to "${topicTitle}". What specific questions do you have about this topic?`;
                    }

                    setMessages([{ role: 'model', text: initialMessage }]);
                    setIsAiReady(true);
                    setRetryAfter(null);
                } catch (e: any) {
                    console.error("Failed to initialize AI Assistant:", e);
                    setError("Failed to initialize AI Assistant. Please check the console for details.");
                    setIsAiReady(false);
                }
            };
            initializeAi();
        } else {
            setMessages([]);
            setInput('');
            setIsLoading(false);
            setError('');
            setRetryAfter(null);
            chatRef.current = null;
            setIsAiReady(false);
        }
    }, [isOpen, context]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Function to parse retry delay from error message
    const parseRetryDelay = (errorMessage: string): number | null => {
        const match = errorMessage.match(/retry in ([\d.]+)s/);
        if (match && match[1]) {
            return Math.ceil(parseFloat(match[1]) * 1000); // Convert to milliseconds
        }
        return null;
    };

    // Function to check if we're still in the retry period
    const isRateLimited = (): boolean => {
        if (retryAfter === null) return false;
        return Date.now() < retryAfter;
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        // Check if we're rate limited
        if (isRateLimited()) {
            const remainingTime = Math.ceil((retryAfter! - Date.now()) / 1000);
            setError(`Rate limit exceeded. Please wait ${remainingTime} seconds before sending another message.`);
            return;
        }

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError('');

        try {
            const result = await chatRef.current.sendMessage(input);
            const response = await result.response;
            const aiText = response.text();
            const modelMessage: ChatMessage = { role: 'model', text: aiText || '' };
            setMessages(prev => [...prev, modelMessage]);
            setRetryAfter(null); // Clear rate limit on successful request
        } catch (err: any) {
            console.error("Error sending message to Gemini:", err);
            
            // Check if this is a rate limit error
            if (err.message && err.message.includes('429')) {
                const delay = parseRetryDelay(err.message);
                if (delay) {
                    const retryTime = Date.now() + delay;
                    setRetryAfter(retryTime);
                    const seconds = Math.ceil(delay / 1000);
                    setError(`Rate limit exceeded. Please wait ${seconds} seconds before sending another message.`);
                } else {
                    setError("Rate limit exceeded. Please wait before sending another message.");
                }
            } else {
                setError("Sorry, I encountered an error. Please try again.");
            }
            // Do not remove user message on error, so they can retry
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate remaining time for rate limit display
    const getRemainingTime = (): number => {
        if (retryAfter === null) return 0;
        const remaining = retryAfter - Date.now();
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="AI Assistant">
            <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-bold text-shadow">A</div>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg text-shadow ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white/10'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-bold text-shadow">A</div>
                            <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-white/10 text-shadow">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {error && <div className="text-red-400 text-sm p-2 text-center">{error}</div>}
                {retryAfter !== null && isRateLimited() && (
                    <div className="text-yellow-400 text-sm p-2 text-center">
                        Rate limit active. Please wait {getRemainingTime()} seconds before sending another message.
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 border-t border-white/20 pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isAiReady ? "Ask about students, exams, data..." : "Initializing AI..."}
                        className="flex-grow block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400 disabled:opacity-50"
                        disabled={isLoading || !!error || !isAiReady || isRateLimited()}
                        aria-label="Chat message input"
                    />
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed" 
                        disabled={isLoading || !input.trim() || !!error || !isAiReady || isRateLimited()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default AIAssistant;