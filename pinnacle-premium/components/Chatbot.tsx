import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { startChat } from '../services/geminiService';
import { MessageSquareIcon, BotIcon, UserIcon, SendIcon, LoaderCircle } from './icons';

type Message = {
    role: 'user' | 'model';
    text: string;
};

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            setMessages([{ role: 'model', text: 'Hello! How can I help you today? Ask me about our platform or general investment topics.' }]);
            const newChat = startChat();
            if(newChat) {
                setChat(newChat);
            } else {
                 setMessages(prev => [...prev, { role: 'model', text: 'Sorry, the AI assistant is currently unavailable. Please configure your API key.' }]);
            }
        }
    }, [isOpen, chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
            if (modelResponse.includes('An admin has been notified')) {
                // Future: trigger actual notification
            }
        } catch (error) {
            console.error('Gemini chat error:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-5 right-5 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 z-50 flex items-center justify-center"
                aria-label="Open AI Chat"
            >
                <MessageSquareIcon className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-5 w-[calc(100%-2.5rem)] sm:w-96 h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col z-[1000] overflow-hidden transform transition-all duration-300 origin-bottom-right">
                    <header className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                        <BotIcon className="w-6 h-6 text-indigo-600" />
                        <h3 className="font-bold text-gray-800">AI Assistant</h3>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-100/50">
                        <div className="flex flex-col gap-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center"><BotIcon className="w-5 h-5"/></div>}
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'}`}>
                                       <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                    {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center"><UserIcon className="w-5 h-5"/></div>}
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center"><BotIcon className="w-5 h-5"/></div>
                                    <div className="max-w-[80%] p-3 rounded-2xl bg-white text-gray-700 border border-gray-200 rounded-bl-none flex items-center">
                                       <LoaderCircle className="w-5 h-5 animate-spin text-indigo-500"/>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                disabled={isLoading || !chat}
                            />
                            <button type="submit" disabled={isLoading || !input.trim() || !chat} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 disabled:text-gray-400 hover:text-indigo-700 transition-colors">
                                <SendIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;