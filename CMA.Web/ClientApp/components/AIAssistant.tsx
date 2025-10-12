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
    const chatRef = useRef<any | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (!process.env.API_KEY) {
                setError("API_KEY is not configured. The AI assistant is disabled.");
                return;
            }
            try {
                const knowledgeBase = localStorage.getItem('cmaKnowledgeBase') || '';
                const systemInstruction = `You are a helpful AI assistant for the FMAA & CMA Admin Dashboard. You are an expert in financial and managerial accounting topics. Your purpose is to help administrators create and manage exam content, analyze student performance data, and answer questions related to the FMAA (Financial and Managerial Accounting Associate) and CMA (Certified Management Accountant) certifications. When the user provides specific context with their question, you must strictly base your answer on that context. If the answer cannot be found in the context, you must state that the provided material does not contain the answer. Be concise and professional.
                
                Here is the knowledge base you should use as a primary reference:
                --- KNOWLEDGE BASE ---
                ${knowledgeBase}
                --- END KNOWLEDGE BASE ---
                `;

                const ai = new GoogleGenerativeAI(process.env.API_KEY);
                const model = ai.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
                
                let initialMessage = 'Hello! I am your FMAA & CMA specialist assistant. How can I help you with the exam content or data analysis today?';
                if (context) {
                    const topicTitle = context.split('\n')[0].replace('## ', '');
                    initialMessage = `I see you're looking at material related to "${topicTitle}". What specific questions do you have about this topic?`;
                }

                setMessages([{ role: 'model', text: initialMessage }]);
                chatRef.current = model;
            } catch (e: any) {
                console.error("Failed to initialize AI Assistant:", e);
                setError("Failed to initialize AI Assistant. Please check the console for details.");
            }
        } else {
            setMessages([]);
            setInput('');
            setIsLoading(false);
            setError('');
            chatRef.current = null;
        }
    }, [isOpen, context]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError('');

        try {
            const promptToSend = context
                ? `Using the following context, please answer the user's question.\n\nCONTEXT:\n${context}\n\nQUESTION:\n${input}`
                : input;

            const result = await chatRef.current.generateContent(promptToSend);
            const response = await result.response;
            const aiText = response.text();
            const modelMessage: ChatMessage = { role: 'model', text: aiText || '' };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err: any) {
            console.error("Error sending message to Gemini:", err);
            setError("Sorry, I encountered an error. Please try again.");
            // Do not remove user message on error, so they can retry
        } finally {
            setIsLoading(false);
        }
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
                <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 border-t border-white/20 pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about students, exams, data..."
                        className="flex-grow block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400 disabled:opacity-50"
                        disabled={isLoading || !!error}
                        aria-label="Chat message input"
                    />
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed" disabled={isLoading || !input.trim() || !!error}>
                        Send
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default AIAssistant;