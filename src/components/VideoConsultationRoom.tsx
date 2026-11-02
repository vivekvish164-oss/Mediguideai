import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  MessageSquare,
  FileText,
  ShieldCheck,
  HeartPulse,
  Send,
  X,
} from 'lucide-react';

export const VideoConsultationRoom: React.FC = () => {
  const { activeVideoAppointment, setActiveVideoAppointment, setActiveTab, role } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // In-call chat
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Encrypted Telehealth Room connected. Audio/Video stream active.', time: '00:00' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        sender: role === 'doctor' ? 'Doctor' : 'Patient',
        text: inputMsg.trim(),
        time: formatTimer(elapsedSeconds),
      },
    ]);
    setInputMsg('');
  };

  const handleEndCall = () => {
    setActiveVideoAppointment(null);
    if (role === 'doctor') {
      setActiveTab('doctor-dashboard');
    } else {
      setActiveTab('appointments');
    }
  };

  const appointment = activeVideoAppointment;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="h-16 px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm">
                Telehealth Consultation: {appointment ? appointment.appointmentCode : 'DEMO-ROOM'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              {role === 'doctor'
                ? `Patient: ${appointment?.patientName || 'Johnathan Doe'}`
                : `Doctor: ${appointment?.doctorName || 'Dr. Sarah Mitchell, MD'}`}
            </p>
          </div>
        </div>

        {/* Live Call Duration */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Compliance info */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>256-Bit Encrypted Video</span>
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:p-6 bg-slate-950 items-center">
          {/* Main Feed: The other participant */}
          <div className="relative h-full min-h-[300px] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            <div className="flex justify-between items-center z-10">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {role === 'doctor'
                  ? appointment?.patientName || 'Patient'
                  : appointment?.doctorName || 'Dr. Sarah Mitchell, MD'}
              </span>
              <span className="text-xs text-slate-400 font-mono">1080p HD</span>
            </div>

            {/* Video Feed Simulation with healthcare visual */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src={
                  role === 'doctor'
                    ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800'
                    : appointment?.doctorAvatar ||
                      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
                }
                alt="Feed"
                className="w-full h-full object-cover opacity-85"
              />
            </div>

            <div className="z-10 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-xl">
              <p className="text-xs text-slate-200">
                {role === 'doctor' ? 'Patient is speaking • Heart Rate: 74 bpm' : 'Doctor is explaining lab assessment'}
              </p>
            </div>
          </div>

          {/* Self Feed (My Camera) */}
          <div className="relative h-full min-h-[300px] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            <div className="flex justify-between items-center z-10">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                You ({role === 'doctor' ? 'Doctor' : 'Patient'})
              </span>
              {isMuted && (
                <span className="px-2 py-0.5 rounded bg-rose-500/80 text-[10px] font-bold">
                  MUTED
                </span>
              )}
            </div>

            {/* My camera feed simulation */}
            {isVideoOn ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src={
                    role === 'doctor'
                      ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
                      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800'
                  }
                  alt="You"
                  className="w-full h-full object-cover opacity-85"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs font-bold">
                Camera is Turned Off
              </div>
            )}

            <div className="z-10 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-xl">
              <p className="text-xs text-slate-300">Local Stream • Mic Active</p>
            </div>
          </div>
        </div>

        {/* In-Call Chat Drawer (Toggleable) */}
        {showChat && (
          <div className="w-80 lg:w-96 border-l border-slate-800 bg-slate-900 flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">In-Call Messages</h3>
              <button onClick={() => setShowChat(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="flex justify-between font-bold text-teal-400 mb-0.5">
                    <span>{m.sender}</span>
                    <span className="text-[10px] text-slate-500">{m.time}</span>
                  </div>
                  <p className="text-slate-200">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Type in-call message..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
              />
              <button type="submit" className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-3 px-6">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3.5 rounded-2xl transition ${
            isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3.5 rounded-2xl transition ${
            !isVideoOn ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-3.5 rounded-2xl transition ${
            isScreenSharing ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Share Screen"
        >
          <Share2 className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowChat(!showChat)}
          className={`p-3.5 rounded-2xl transition relative ${
            showChat ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Toggle Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Leave Consultation</span>
        </button>
      </div>
    </div>
  );
};
