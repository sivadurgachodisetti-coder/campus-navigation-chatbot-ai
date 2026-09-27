import React, { useState, useRef, useEffect } from 'react';
import { classifyAndProcessQuery, IntentAnalysisResult, UserIntent } from '../utils/intentClassifier';
import { BFSResult } from '../utils/bfsPathfinder';
import {
  Send,
  Bot,
  User,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
  Mic,
  MicOff,
  Copy,
  Check,
  Eye,
  CornerDownRight,
  Layers,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  intent?: UserIntent;
  confidence?: number;
  bfsResult?: BFSResult;
  roomInfo?: any;
}

interface ChatInterfaceProps {
  onRouteSelected: (bfsResult: BFSResult) => void;
  onOpenBFSTrace: (bfsResult: BFSResult) => void;
  onOpenRoomDirectory: () => void;
  onOpenBTechDocs: () => void;
}

const QUICK_SUGGESTIONS = [
  'Where is CSE Lab?',
  'Where is Room 205?',
  'How can I reach the library?',
  'Where is the AIML department?',
  'How do I go from main gate to the CSE block?',
  'Where is the canteen?',
  'What is near the seminar hall?',
  'What are the library timings?',
  'Where is Room 999?', // for testing unknown
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onRouteSelected,
  onOpenBFSTrace,
  onOpenRoomDirectory,
  onOpenBTechDocs,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! I am your College Campus Navigation Assistant 🎓.\n\nI can help you locate classrooms, laboratories, departments, libraries, canteens, and find the shortest walking paths across our campus using BFS (Breadth-First Search).\n\nWhat location are you looking for today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: 'GENERAL',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Analyze Query using NLP classifier & BFS
    const analysis: IntentAnalysisResult = classifyAndProcessQuery(query);

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: analysis.replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: analysis.intent,
      confidence: analysis.confidence,
      bfsResult: analysis.bfsResult,
      roomInfo: analysis.entities.roomInfo,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputText('');

    // If BFS route is discovered, broadcast to the map immediately
    if (analysis.bfsResult && analysis.bfsResult.found) {
      onRouteSelected(analysis.bfsResult);
    }
  };

  // Speech Recognition support (Web Speech API)
  const toggleSpeechRecognition = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIntentBadge = (intent?: UserIntent) => {
    if (!intent || intent === 'UNKNOWN') return null;
    const badgeColors: Record<UserIntent, string> = {
      DIRECTIONS: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      LOCATION: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      TIMING: 'bg-amber-950 text-amber-300 border-amber-800',
      GENERAL: 'bg-blue-950 text-blue-300 border-blue-800',
      UNKNOWN: 'bg-slate-800 text-slate-400 border-slate-700',
    };
    return (
      <span
        className={`px-2 py-0.5 text-[10px] uppercase font-mono font-semibold rounded border ${badgeColors[intent]}`}
      >
        Intent: {intent}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-slate-100">
      {/* Chat Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white text-sm">Campus Guide Bot</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400">Natural-Language Campus Wayfinding</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRoomDirectory}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Room Search</span>
          </button>
          <button
            onClick={onOpenBTechDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Project Docs</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 transition-all ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md font-medium'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}
            >
              {/* Intent Tag & Copy for Bot */}
              {msg.sender === 'bot' && (
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-2">
                    {getIntentBadge(msg.intent)}
                    {msg.confidence && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {Math.round(msg.confidence * 100)}% match
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}

              {/* Message text with pre-wrap formatting */}
              <div className="whitespace-pre-line font-normal text-slate-100">{msg.text}</div>

              {/* Route Summary Action Card if BFS Route is attached */}
              {msg.bfsResult && msg.bfsResult.found && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Navigation className="w-3.5 h-3.5" /> Shortest BFS Route Calculated
                    </span>
                    <span className="font-mono text-slate-400">
                      {msg.bfsResult.totalDistanceMeters}m · {msg.bfsResult.estimatedWalkingMinutes} min
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onRouteSelected(msg.bfsResult!)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors text-[11px]"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Campus Map</span>
                    </button>
                    <button
                      onClick={() => onOpenBFSTrace(msg.bfsResult!)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors text-[11px]"
                      title="Inspect Breadth-First Search Algorithm queue"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>BFS Trace</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-[10px] text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 overflow-x-auto flex items-center gap-1.5 text-xs no-scrollbar">
        <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-1">Suggestions:</span>
        {QUICK_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSendMessage(suggestion)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg shrink-0 whitespace-nowrap transition-colors text-[11px] border border-slate-700"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g., 'Where is Room 205?', 'How to reach Canteen?')..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Voice Input (Speech Recognition)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-medium transition-colors shadow-sm shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
