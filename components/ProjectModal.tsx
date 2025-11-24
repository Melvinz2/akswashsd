
import React, { useState, useEffect, useRef } from 'react';
import { Project, Student, ChatMessage } from '../types';
import { createProjectChatSession, explainCommand } from '../services/geminiService';
import Markdown from 'react-markdown';
import { Chat, GenerateContentResponse } from '@google/genai';

interface ProjectModalProps {
  project: Project;
  student: Student;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, student, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'ai'>('terminal');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [commandExplanation, setCommandExplanation] = useState<string>('');

  // Chat State
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatInitialized, setChatInitialized] = useState(false);
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [connectionError, setConnectionError] = useState(false);

  // Menggunakan relative path ke folder public/downloads
  const downloadUrl = `${window.location.origin}/downloads/${project.zipFileName}`;
  const generatedCommand = `curl -L -o ${project.zipFileName} "${downloadUrl}"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCommand);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab, isAnalyzing]);

  // Load command explanation once
  useEffect(() => {
    const fetchExplanation = async () => {
        const explanation = await explainCommand(generatedCommand);
        setCommandExplanation(explanation);
    };
    fetchExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startChatSession = async () => {
    setConnectionError(false);
    setIsAnalyzing(true);
    setChatInitialized(true);
    
    // Simulation of Code Analysis (Visual only)
    const steps = [
        `> Connecting to CodeVault Neural Network...`,
        `> Analying project structure for '${project.title}'...`,
        `> Parsing ${project.language} syntax trees...`,
        `> Loading file context: ${project.fileStructure.split('\n')[1] || 'src/'}...`,
        `> Establishing secure session...`
    ];

    for (const step of steps) {
        setAnalysisStep(step);
        await new Promise(r => setTimeout(r, 800)); // Delay for effect
    }

    try {
        const chat = createProjectChatSession(project);
        setChatSession(chat);

        // Initial greeting from AI
        const result = await chat.sendMessage("Hello! Please introduce yourself and this project briefly.");
        setMessages([{ role: 'model', text: result.text || "System online. Ready to assist with the codebase." }]);
        setIsAnalyzing(false);
    } catch (error) {
        console.error("AI Connection Failed:", error);
        setConnectionError(true);
        setIsAnalyzing(false);
    }
  };

  // Initialize Chat when tab is switched to AI
  useEffect(() => {
    if (activeTab === 'ai' && !chatInitialized) {
        startChatSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chatSession || isStreaming) return;

    const userMsg = inputMessage.trim();
    setInputMessage(''); // Clear input immediately
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsStreaming(true);

    try {
      // Add placeholder for AI response
      setMessages(prev => [...prev, { role: 'model', text: '', isThinking: true }]);

      const resultStream = await chatSession.sendMessageStream(userMsg);
      
      let fullText = '';
      
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        // Update the last message (the AI's placeholder) with the growing text
        setMessages(prev => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          if (lastMsg.role === 'model') {
             lastMsg.text = fullText;
             lastMsg.isThinking = false;
          }
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Lost connection to AI tutor." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-terminal-bg w-full max-w-4xl h-[85vh] rounded-xl border border-terminal-border shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-terminal-border bg-terminal-header shrink-0">
          <h3 className="text-xl font-bold text-white font-mono truncate pr-4">
            {project.title} <span className="text-gray-500 text-sm ml-2">[{project.language}]</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-terminal-border bg-terminal-header/50 shrink-0">
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-6 py-3 text-sm font-medium font-mono transition-colors ${activeTab === 'terminal' ? 'text-terminal-green border-b-2 border-terminal-green bg-terminal-bg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            >_ TERMINAL
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 text-sm font-medium font-mono transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'text-terminal-blue border-b-2 border-terminal-blue bg-terminal-bg' : 'text-gray-400 hover:text-gray-200'}`}
          >
             <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-blue"></span>
              </span>
             AI CHATBOT
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* TERMINAL TAB */}
          {activeTab === 'terminal' && (
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Use the command below to download the source code directly to your machine via terminal.
                  </p>
                  <div className="bg-black rounded-lg border border-terminal-border p-4 font-mono text-sm relative group">
                     <div className="flex items-start gap-2 text-gray-300 break-all">
                        <span className="text-terminal-green select-none">$</span>
                        <span className="flex-1">{generatedCommand}</span>
                     </div>
                     
                     <button 
                      onClick={handleCopy}
                      className="absolute top-2 right-2 bg-terminal-border hover:bg-gray-700 text-xs text-white px-2 py-1 rounded transition-colors"
                     >
                       {copyFeedback ? 'COPIED!' : 'COPY'}
                     </button>
                  </div>
                  {commandExplanation && (
                      <p className="mt-2 text-xs text-gray-500 font-mono">
                          * {commandExplanation}
                      </p>
                  )}
                </div>

                <div className="bg-terminal-header p-4 rounded border border-terminal-border">
                  <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Or Download Manually</h4>
                  <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Direct zip file download</span>
                      <a 
                          href={downloadUrl}
                          download
                          className="bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green border border-terminal-green/50 px-4 py-2 rounded text-sm font-mono transition-colors flex items-center gap-2"
                      >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          {project.zipFileName}
                      </a>
                  </div>
                </div>

                <div className="border-t border-terminal-border pt-4">
                  <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">File Structure Preview</h4>
                  <pre className="text-xs text-gray-400 font-mono bg-terminal-header/50 p-4 rounded overflow-x-auto">
                    {project.fileStructure}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* AI CHATBOT TAB */}
          {activeTab === 'ai' && (
            <div className="flex flex-col h-full bg-terminal-bg relative">
              
              {/* ANALYSIS & ERROR STATES */}
              {(isAnalyzing || connectionError) && (
                  <div className="absolute inset-0 z-10 bg-terminal-bg flex items-center justify-center p-8">
                      {isAnalyzing && (
                          <div className="w-full max-w-md text-center font-mono">
                              <div className="mb-4 text-terminal-blue animate-pulse text-xl font-bold">SYSTEM ANALYZING CODEBASE</div>
                              <div className="h-2 bg-terminal-border rounded-full overflow-hidden mb-2">
                                  <div className="h-full bg-terminal-blue animate-pulse w-2/3"></div>
                              </div>
                              <div className="text-xs text-gray-400">{analysisStep}</div>
                          </div>
                      )}
                      {connectionError && (
                          <div className="text-center">
                              <div className="text-red-500 text-lg mb-2">Connection to AI Failed</div>
                              <p className="text-gray-500 text-sm mb-4">Could not establish secure link to CodeVault Brain.</p>
                              <button 
                                onClick={startChatSession}
                                className="bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900 px-4 py-2 rounded font-mono text-sm transition-colors"
                              >
                                RETRY CONNECTION
                              </button>
                          </div>
                      )}
                  </div>
              )}

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[85%] rounded-lg p-3 text-sm font-sans ${
                           msg.role === 'user' 
                             ? 'bg-terminal-border text-white rounded-br-none' 
                             : 'bg-terminal-header border border-terminal-border text-gray-300 rounded-bl-none'
                       }`}>
                          {msg.isThinking ? (
                             <div className="flex space-x-1 h-5 items-center px-2">
                                <div className="w-2 h-2 bg-terminal-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-terminal-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-terminal-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                             </div>
                          ) : (
                              <div className="prose prose-invert prose-sm max-w-none">
                                <Markdown
                                    components={{
                                        code(props) {
                                            const {children, className, node, ...rest} = props
                                            return (
                                            <code {...rest} className={`${className} bg-black/50 px-1 py-0.5 rounded text-terminal-green font-mono text-xs`}>
                                                {children}
                                            </code>
                                            )
                                        }
                                    }}
                                >
                                    {msg.text}
                                </Markdown>
                              </div>
                          )}
                       </div>
                    </div>
                 ))}
                 <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-terminal-border bg-terminal-header">
                 <div className="flex gap-2 items-end bg-terminal-bg border border-terminal-border rounded-lg p-2 focus-within:border-terminal-blue transition-colors">
                    <div className="pl-2 pb-2 text-terminal-green select-none animate-pulse">$</div>
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about code structure, logic, or concepts..."
                        className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 resize-none text-sm font-mono py-2 max-h-32 custom-scrollbar"
                        rows={1}
                        style={{ minHeight: '40px' }}
                        disabled={isAnalyzing || connectionError}
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isStreaming || isAnalyzing || connectionError}
                        className="p-2 bg-terminal-blue/10 hover:bg-terminal-blue/20 text-terminal-blue rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                 </div>
                 <p className="text-[10px] text-gray-600 mt-2 text-center font-mono">
                    AI analyzes project metadata & structure. Code snippets may be simulated.
                 </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
