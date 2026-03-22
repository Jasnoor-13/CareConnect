import React, { useState, useEffect } from 'react';

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [queue, setQueue] = useState({ opd_wait: 0 });
  
  // Navigation States
  const [activeTab, setActiveTab] = useState('home'); 
  const [view, setView] = useState('patient'); 

  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:5000/api/hospitals').then(res => res.json()).then(setHospitals);
      fetch('http://127.0.0.1:5000/api/queue-status').then(res => res.json()).then(setQueue);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChat = async () => {
    if(!chatInput) return;
    const res = await fetch('http://127.0.0.1:5000/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: chatInput })
    });
    const data = await res.json();
    setChatLog([...chatLog, { user: chatInput, bot: data.reply }]);
    setChatInput("");
  };

  const navigateToMap = (h) => {
    // Proximity-based discovery navigation [cite: 92, 94]
    window.open(`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* 1. Header - Track & Team Info [cite: 4, 5] */}
      <header className="bg-blue-600 text-white p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold italic">CareConnect</h1>
          <p className="text-sm opacity-80">Smart Hospital Access & Intelligence</p>
        </div>
        <div className="text-right text-xs">
          <p>Track: Health Tech / AI</p>
          <p className="font-mono font-bold">Team: KRYPT</p>
        </div>
      </header>

      {/* 2. Top View Switcher - Private Portal [cite: 74, 96] */}
      <nav className="bg-white border-b flex justify-center gap-8 p-2 text-sm font-bold sticky top-0 z-10">
        <button 
          onClick={() => { setView('patient'); setActiveTab('home'); }} 
          className={`pb-2 px-4 transition-all ${view === 'patient' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400'}`}
        >
          PATIENT HUB
        </button>
        <button 
          onClick={() => setView('doctor')} 
          className={`pb-2 px-4 transition-all ${view === 'doctor' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400'}`}
        >
          DOCTOR PORTAL
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-4 mt-4">
        
        {/* VIEW 1: PATIENT HUB CONTENT */}
        {view === 'patient' && (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'home' && (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Real-time Queue Visibility [cite: 55, 89] */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
                    <h3 className="text-gray-500 font-bold mb-4 flex items-center uppercase text-xs tracking-widest">
                      <span className="mr-2 text-lg">🕒</span> Live Queue Status
                    </h3>
                    <div className="flex justify-around items-center py-4">
                      <div className="text-center">
                        <p className="text-5xl font-black text-blue-600">{queue.opd_wait}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">Avg OPD Wait</p>
                      </div>
                      <div className="h-16 w-px bg-slate-100"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500 animate-pulse">EMERGENCY</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">Status: Priority</p>
                      </div>
                    </div>
                  </div>

                  {/* AI First-Aid Bot [cite: 63, 91] */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-cyan-400">
                    <h3 className="text-gray-500 font-bold mb-4 flex items-center uppercase text-xs tracking-widest">
                      <span className="mr-2 text-lg">🤖</span> AI Assistant
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 h-32 overflow-y-auto mb-4 text-sm">
                      {chatLog.map((msg, i) => (
                        <div key={i} className="mb-2">
                          <p className="text-[10px] font-bold text-blue-400 uppercase">You: {msg.user}</p>
                          <p className="bg-white p-2 rounded-lg border border-slate-100 mt-1">{msg.bot}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 border-2 border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500"
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)} 
                        placeholder="Ask about first-aid..." 
                      />
                      <button onClick={handleChat} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Ask</button>
                    </div>
                  </div>
                </div>

                {/* Heatmap & Discovery [cite: 92, 149] */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-gray-800 font-bold mb-6">Nearby Facilities & Live Heatmap</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {hospitals.map(h => (
                      <div key={h.id} className="border-2 border-slate-50 rounded-2xl p-5 hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-slate-800">{h.name}</h4>
                          <div className={`h-3 w-3 rounded-full ${h.occupancy === 'Low' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Crowd Density: {h.occupancy}</p>
                        <button 
                          onClick={() => navigateToMap(h)}
                          className="w-full text-xs font-bold py-2.5 rounded-xl border-2 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          Navigate to Facility
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white p-10 rounded-3xl shadow-sm animate-in slide-in-from-right">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">Appointment Booking [cite: 60, 90]</h2>
                <p className="text-gray-500 mb-8 text-sm italic">Density-aware scheduling to prevent hospital overcrowding.</p>
                <div className="grid gap-4 max-w-md mx-auto">
                  <input type="text" placeholder="Patient Name" className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                  <select className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Specialization</option>
                    <option>Cardiology (Low Wait)</option>
                    <option>Pediatrics (Medium Wait)</option>
                  </select>
                  <button className="bg-blue-600 text-white p-4 rounded-2xl font-bold hover:shadow-lg transition-all">Confirm Density-Optimized Slot</button>
                </div>
              </div>
            )}

            {activeTab === 'blood' && (
              <div className="bg-white p-10 rounded-3xl shadow-sm animate-in slide-in-from-right text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-8 uppercase tracking-widest">Live Blood Bank [cite: 100, 171]</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['O+', 'A-', 'B+', 'AB+'].map(type => (
                    <div key={type} className="p-6 border-2 border-red-50 rounded-3xl bg-red-50/20">
                      <p className="text-4xl font-black text-red-600">{type}</p>
                      <p className="text-[10px] font-bold text-red-300 uppercase mt-2">Available</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="bg-red-600 text-white p-12 rounded-[3rem] shadow-2xl text-center animate-pulse">
                <h2 className="text-4xl font-black mb-6 uppercase italic">Critical Care Link [cite: 150, 151]</h2>
                <p className="text-lg mb-8 opacity-90 font-medium">Prioritizing emergency cases through smart triage.</p>
                <button className="bg-white text-red-600 px-12 py-6 rounded-3xl font-black text-2xl hover:scale-105 transition-transform shadow-xl">
                  REQUEST AMBULANCE NOW
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: DOCTOR PORTAL [cite: 96, 162] */}
        {view === 'doctor' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
                  <h3 className="text-cyan-400 font-bold mb-8 italic tracking-wider uppercase text-sm">Resource Management Console [cite: 98]</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">ICU BEDS</p>
                      <p className="text-3xl font-bold">12 / 40</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Oxygen</p>
                      <p className="text-3xl font-bold text-green-400">92%</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Blood Units</p>
                      <p className="text-3xl font-bold">18</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Flow Control [cite: 78, 172]</p>
                  <p className="text-5xl font-black text-blue-600">82%</p>
                  <p className="text-xs text-slate-500 mt-2 italic font-medium">Optimal Patient Inflow</p>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* 3. Bottom Navigation  */}
      {view === 'patient' && (
        <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t p-4 flex justify-around items-center z-20">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'bookings', icon: '📅', label: 'Bookings' },
            { id: 'blood', icon: '🩸', label: 'Blood Bank' },
            { id: 'emergency', icon: '🚑', label: 'Emergency' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`flex flex-col items-center transition-all ${activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter mt-1">{tab.label}</span>
            </button>
          ))}
        </footer>
      )}
    </div>
  );
}

// THIS LINE FIXES THE "DEFAULT EXPORT" ERROR
export default App;