import { useState } from 'react';
import type { Language } from './data/translations';

// นำเข้า Components หลัก
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// นำเข้าหน้าต่างๆ
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SpotCheck } from './pages/SpotCheck';
import { Reports } from './pages/Reports';
import { LiveFeed } from './pages/LiveFeed';
import { VideoLibrary } from './pages/VideoLibrary';
import { UserManagement } from './pages/UserManagement';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState<Language>('th');
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // ถ้ายังไม่ได้ล็อกอิน -> โชว์หน้า Login
  if (!isLoggedIn) {
    return (
      <Login 
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLoginSuccess={() => setIsLoggedIn(true)} 
      />
    );
  }

  // รวมหน้าที่มีการสร้างเสร็จแล้ว
  const availablePages = ['dashboard', 'activities', 'reports', 'live', 'videos', 'users'];

  // ถ้าล็อกอินแล้ว -> โชว์ Layout หลัก
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* ส่วนหัวของเว็บไซต์ */}
      <Header 
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentPage('dashboard');
        }}
      />

      <main className="flex-1 p-6 max-w-1600px w-full mx-auto">
        {currentPage === 'dashboard' && <Dashboard language={language} darkMode={darkMode} />}
        {currentPage === 'activities' && <SpotCheck language={language} darkMode={darkMode} />}
        {currentPage === 'reports' && <Reports language={language} darkMode={darkMode} />}
        {currentPage === 'live' && <LiveFeed language={language} darkMode={darkMode} />}
        {currentPage === 'videos' && <VideoLibrary language={language} darkMode={darkMode} />}
        {currentPage === 'users' && <UserManagement language={language} darkMode={darkMode} />} 

        {!availablePages.includes(currentPage) && (
          <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
            <div className={`text-center p-12 max-w-lg mx-auto rounded-3xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-[#0c274b] to-[#1a3a5c] shadow-lg mb-8 border-4 border-[#fcd500]/20 relative">
                 <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#fcd500]">
                   <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                 </svg>
              </div>

              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
                {language === 'th' ? 'ระบบกำลังพัฒนา' : 'Under Construction'}
              </h2>
              
              <p className={`text-lg mb-8 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'th' 
                  ? <>ขออภัย เมนู <span className="font-bold text-[#fcd500] uppercase tracking-wider px-1">{currentPage}</span><br/>กำลังอยู่ในระหว่างการจัดทำ จะเปิดให้ใช้งานเร็วๆ นี้</>
                  : <>Sorry, the <span className="font-bold text-[#fcd500] uppercase tracking-wider px-1">{currentPage}</span> menu is currently under development. It will be available soon.</>
                }
              </p>

              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="px-8 py-3.5 bg-linear-to-r from-[#fcd500] to-[#fed300] hover:from-[#fed300] hover:to-[#fcd500] text-[#0c274b] font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                {language === 'th' ? 'กลับสู่หน้าหลัก (Dashboard)' : 'Back to Dashboard'}
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer language={language} darkMode={darkMode} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div> 
  );
}