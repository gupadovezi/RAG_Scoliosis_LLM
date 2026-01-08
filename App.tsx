
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, Message } from './types';
import { generateScoliosisResponse } from './geminiService';
import { 
  Stethoscope, 
  User, 
  Send, 
  RotateCcw, 
  Info, 
  ChevronRight, 
  Activity,
  UserCheck,
  ClipboardList
} from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am your SOSORT Guide AI. I can provide information and recommendations based on the 2016 SOSORT guidelines for the treatment of scoliosis. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Convert history for Gemini
      const history = messages.map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: msg.content }]
      }));

      const responseText = await generateScoliosisResponse(input, role, history);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || "I'm sorry, I couldn't generate a response based on the guidelines.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Chat reset. I am now responding as a guide for ${role === UserRole.PATIENT ? 'patients' : 'healthcare professionals'}. How can I assist you with the SOSORT guidelines?`,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">SOSORT Guide AI</h1>
            <p className="text-xs text-slate-500 font-medium">2016 Guidelines Benchmark</p>
          </div>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          <button 
            onClick={() => { setRole(UserRole.PATIENT); resetChat(); }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${role === UserRole.PATIENT ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User className="w-4 h-4" />
            <span>Patient</span>
          </button>
          <button 
            onClick={() => { setRole(UserRole.PROFESSIONAL); resetChat(); }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${role === UserRole.PROFESSIONAL ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Professional</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
                </div>
                <div 
                  className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none prose prose-slate max-w-none'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="markdown-content">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-2'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    msg.content
                  )}
                  <p className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center animate-pulse">
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Action Footer */}
      <footer className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
          {/* Quick Suggestions */}
          <div className="flex overflow-x-auto space-x-2 pb-3 no-scrollbar mb-2">
            {[
              "What is Risser 0?",
              "Bracing hours for 25° curve?",
              "Role of PSSE?",
              "Adam's Test criteria?",
              "Surgery vs Bracing"
            ].map((text, i) => (
              <button 
                key={i}
                onClick={() => setInput(text)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-colors"
              >
                {text}
              </button>
            ))}
          </div>

          <div className="relative flex items-center space-x-2">
            <button 
              onClick={resetChat}
              title="Reset Chat"
              className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors rounded-xl border border-slate-200"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask as a ${role}...`}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-3 text-[10px] text-slate-400">
            <Info className="w-3 h-3 mr-1" />
            <span>AI responses are grounded in SOSORT 2016 Guidelines. Always consult your spine specialist.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
