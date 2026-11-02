import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor } from '../types';
import {
  Bot,
  Send,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Calendar,
  Languages,
  User,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface ChatEntry {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isEmergency?: boolean;
  recommendedSpecialty?: string;
  recommendedDoctors?: Doctor[];
  timestamp: string;
}

export const AiAssistantView: React.FC<{
  onBookDoctor: (doctor: Doctor) => void;
}> = ({ onBookDoctor }) => {
  const { doctors, patientProfile, language, setLanguage, setActiveTab } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं मेडीगाइड AI हूँ, आपका समर्पित स्वास्थ्य सहायक। आप अपने लक्षणों, सामान्य स्वास्थ्य प्रश्नों या किसी भी स्वास्थ्य चिंता के बारे में मुझसे पूछ सकते हैं। मैं आपको सही विशेषज्ञ खोजने में मदद करूंगा।'
          : "Hello! I am MediGuide AI, your intelligent healthcare guide. Describe any symptoms you're experiencing, ask general wellness questions, or let me recommend the right certified specialist for you.",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      en: "I've had a recurring headache with light sensitivity for 3 days",
      hi: 'मुझे 3 दिनों से प्रकाश संवेदनशीलता के साथ सिरदर्द हो रहा है',
      specialty: 'Neurology',
    },
    {
      en: 'Red, itchy rash appeared on my forearm yesterday',
      hi: 'कल मेरी बांह पर लाल, खुजलीदार दाने निकल आए',
      specialty: 'Dermatology',
    },
    {
      en: 'Chest pressure, shortness of breath, and left arm pain',
      hi: 'सीने में दबाव, सांस फूलना और बाएं हाथ में दर्द',
      specialty: 'Emergency Medicine',
    },
    {
      en: 'What questions should I ask my doctor about high blood pressure?',
      hi: 'उच्च रक्तचाप के बारे में मुझे डॉक्टर से क्या पूछना चाहिए?',
      specialty: 'Cardiology',
    },
    {
      en: 'My 4-year-old has mild fever (100.8°F) and a dry cough',
      hi: 'मेरे 4 साल के बच्चे को हल्का बुखार और सूखी खांसी है',
      specialty: 'Pediatrics',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userEntry: ChatEntry = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userEntry]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          language,
          patientContext: {
            age: patientProfile.age,
            gender: patientProfile.gender,
            allergies: patientProfile.allergies,
            chronicConditions: patientProfile.chronicConditions,
          },
        }),
      });

      const data = await response.json();

      let matchingDocs: Doctor[] = [];
      if (data.recommendedSpecialty && data.recommendedSpecialty !== 'Emergency Medicine') {
        matchingDocs = doctors
          .filter(
            d =>
              d.status === 'active' &&
              d.specialization.toLowerCase().includes(data.recommendedSpecialty.toLowerCase())
          )
          .slice(0, 2);
      }

      const assistantEntry: ChatEntry = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: data.reply,
        isEmergency: data.isEmergency,
        recommendedSpecialty: data.recommendedSpecialty,
        recommendedDoctors: matchingDocs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantEntry]);
    } catch (err) {
      console.error('Error contacting AI triage API:', err);
      const fallbackEntry: ChatEntry = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text:
          language === 'hi'
            ? 'सॉरी, नेटवर्क की समस्या के कारण मैं तुरंत उत्तर नहीं दे सका। कृपया डॉक्टर सूची से विशेषज्ञ का चयन करें।'
            : 'I am here to assist. For common ailments or symptom evaluations, consulting a General Physician or relevant specialist is recommended.',
        recommendedSpecialty: 'General Medicine',
        recommendedDoctors: doctors.slice(0, 2),
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, fallbackEntry]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI Clinical Triage Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'hi' ? 'मेडीगाइड AI लक्षण एवं स्वास्थ्य सहायक' : 'MediGuide AI Health Assistant'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Discuss symptoms, explore health education, and receive instant specialist recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <Languages className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'en' ? 'हिंदी में पूछें' : 'English'}</span>
          </button>
          <button
            onClick={() => {
              setMessages([
                {
                  id: 'msg-reset',
                  sender: 'assistant',
                  text: language === 'hi' ? 'चैट रीसेट हो गई है। आप क्या पूछना चाहते हैं?' : 'Chat reset. What symptoms or questions would you like to explore?',
                  timestamp: 'Just now',
                },
              ]);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="mb-4 p-3 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 text-teal-900 dark:text-teal-200 text-xs flex items-center gap-2.5">
        <Bot className="w-4 h-4 text-teal-600 shrink-0" />
        <span className="leading-relaxed">
          <strong className="font-extrabold">Informational Only:</strong> MediGuide AI responses are designed for educational guidance and do not replace professional diagnosis, treatment, or clinical consultation.
        </span>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] space-y-3`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-xs'
                      : msg.isEmergency
                      ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100 border-2 border-rose-500 rounded-tl-xs shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                  }`}
                >
                  {/* Emergency Critical Box */}
                  {msg.isEmergency && (
                    <div className="mb-3 p-3 rounded-xl bg-rose-600 text-white font-bold flex items-center gap-2 text-xs">
                      <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce" />
                      <span>URGENT: Immediate Emergency Medical Attention Required!</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[10px] block text-right mt-2 ${msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* If Emergency, render immediate SOS action button */}
                {msg.isEmergency && (
                  <div className="p-3 bg-rose-100 dark:bg-rose-950 rounded-2xl border border-rose-300 dark:border-rose-800 flex items-center justify-between gap-3">
                    <div className="text-xs text-rose-800 dark:text-rose-200 font-bold">
                      Call 911 / 112 / 108 Immediately
                    </div>
                    <button
                      onClick={() => setActiveTab('emergency')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Emergency Hub →</span>
                    </button>
                  </div>
                )}

                {/* Interactive Recommended Doctors in Chat */}
                {msg.recommendedDoctors && msg.recommendedDoctors.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        Recommended {msg.recommendedSpecialty} Specialists:
                      </span>
                      <button
                        onClick={() => setActiveTab('doctors')}
                        className="text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline"
                      >
                        View all →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendedDoctors.map(doc => (
                        <div
                          key={doc.id}
                          className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-teal-200 dark:border-teal-700 flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={doc.avatarUrl}
                              alt={doc.name}
                              className="w-10 h-10 rounded-lg object-cover ring-1 ring-teal-500/30 shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.name}</p>
                              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{doc.specialization} • ${doc.consultationFee}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onBookDoctor(doc)}
                            className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shrink-0 transition"
                          >
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <span>MediGuide AI is analyzing clinical guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(language === 'hi' ? p.hi : p.en)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 text-slate-700 dark:text-slate-300 text-xs font-medium whitespace-nowrap transition shrink-0"
            >
              {language === 'hi' ? p.hi : p.en}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'अपने लक्षण बताएं या कोई स्वास्थ्य प्रश्न पूछें...'
                  : "Type symptoms, concerns, or e.g. 'Recommend a doctor for chest pain'..."
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-teal-600/25 transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
