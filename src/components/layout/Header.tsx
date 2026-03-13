import { useState, useEffect } from 'react';
import { 
  Camera, Bell, Globe, Sun, Moon, User, ChevronDown, LogOut, 
  Menu, X, KeyRound, AlertCircle, Clock,
  LayoutDashboard, Activity, FileText, Video, FileVideo, Users 
} from 'lucide-react';
import { translations, type Language } from '../../data/translations';
import { allAlerts } from '../../data/mockData';
import { Sidebar } from './Sidebar';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}

export function Header({ 
  language, setLanguage, darkMode, setDarkMode, currentPage, setCurrentPage, onLogout 
}: HeaderProps) {
  
  const t = translations[language];
  
  // States สำหรับเปิด-ปิดเมนูต่างๆ ใน Header
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // States สำหรับรหัสผ่าน
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // ข้อมูลเมนู (ดึงไอคอนจาก Lucide)
  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'activities', label: t.activities, icon: Activity },
    { id: 'reports', label: t.reports, icon: FileText },
    { id: 'live', label: t.live, icon: Video },
    { id: 'videos', label: t.videos, icon: FileVideo },
    { id: 'users', label: t.users, icon: Users },
  ];

  const alerts = allAlerts.slice(0, 4); // แสดงแค่ 4 รายการล่าสุด

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showNotifications && !target.closest('[data-notification-panel]') && !target.closest('[data-notification-button]')) {
        setShowNotifications(false);
      }
      if (showUserDropdown && !target.closest('[data-user-dropdown]')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showUserDropdown]);

  return (
    <>
      <header className={`border-b sticky top-0 z-40 shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#0c274b] to-blue-800 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Camera className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0">
              <span className={`text-base sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'} block truncate`}>
                Body Worn Camera
              </span>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>Control System</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Notification Button */}
            <div className="relative">
              <button 
                data-notification-button
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`relative flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all hover:shadow-md cursor-pointer ${darkMode ? 'text-white hover:bg-gray-700' : 'text-[#0c274b] hover:bg-gray-50'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="hidden lg:inline">{t.notifications}</span>
                {alerts.length > 0 && (
                  <div className="absolute top-0 right-0 sm:top-1 sm:right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{alerts.length}</span>
                  </div>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifications && (
                <div data-notification-panel className={`absolute right-0 top-full mt-2 w-full sm:w-96 rounded-2xl shadow-2xl border z-50 max-h-[85vh] sm:max-h-[600px] overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="p-4 border-b bg-linear-to-r from-[#fcd500] to-[#fed300]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-[#0c274b]" /><h3 className="font-bold text-[#0c274b]">{t.notificationTitle}</h3></div>
                      <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-[#0c274b]/10 rounded-lg cursor-pointer"><X className="w-5 h-5 text-[#0c274b]" /></button>
                    </div>
                  </div>
                  <div className={`divide-y overflow-y-auto max-h-[400px] ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 transition-all cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${alert.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            <AlertCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold text-white ${alert.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'}`}>
                              {t[alert.typeKey as keyof typeof t] || alert.typeKey}
                            </span>
                            <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{t.officer}: {alert.officer}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3" /> {alert.time} น.
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`p-3 border-t text-center ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <button onClick={() => { setShowNotifications(false); setCurrentPage('dashboard'); }} className="text-blue-500 text-sm font-bold hover:underline cursor-pointer">
                      ดูการแจ้งเตือนทั้งหมด
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button onClick={() => setLanguage(language === 'th' ? 'en' : 'th')} className={`hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${darkMode ? 'text-white hover:bg-gray-700' : 'text-[#0c274b] hover:bg-gray-50'}`}>
              <Globe className="w-4 h-4" /> <span className="font-semibold text-sm">{language.toUpperCase()}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin Dropdown */}
            <div className="hidden md:block relative" data-user-dropdown>
              <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#fcd500] to-[#fed300] text-[#0c274b] rounded-xl font-medium cursor-pointer hover:shadow-md">
                <User className="w-5 h-5" /> <span className="hidden lg:inline">Admin</span> <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showUserDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl overflow-hidden z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <button onClick={() => { setShowUserDropdown(false); setShowChangePasswordModal(true); }} className={`w-full px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <KeyRound className="w-4 h-4" /> <span className="font-medium text-sm">{t.changePassword}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logout */}
            <button onClick={onLogout} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:shadow-md cursor-pointer ${darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}>
              <LogOut className="w-5 h-5" /> <span className="hidden lg:inline">{t.logout}</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden lg:block px-6 border-t ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex gap-2 overflow-x-auto justify-center max-w-5xl mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 font-medium transition-all relative whitespace-nowrap rounded-t-xl cursor-pointer ${isActive ? (darkMode ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-[#0c274b] shadow-lg') : (darkMode ? 'text-gray-400 hover:bg-gray-800/60' : 'text-gray-600 hover:bg-white/60')}`}
                >
                  <Icon className="w-5 h-5" /> <span>{item.label}</span>
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"></div>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className={`lg:hidden px-6 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button onClick={() => setShowMobileMenu(true)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${darkMode ? 'text-white hover:bg-gray-700' : 'text-[#0c274b] hover:bg-gray-100'}`}>
            <Menu className="w-6 h-6" /> <span className="font-medium">Menu</span>
          </button>
        </div>
      </header>

      {/* ----------------- เรียกใช้ Sidebar Component แทนที่โค้ดเดิม ----------------- */}
      <Sidebar 
        isOpen={showMobileMenu} 
        onClose={() => setShowMobileMenu(false)} 
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
      />

      {/* ----------------- Change Password Modal ----------------- */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="bg-linear-to-r from-[#0c274b] to-[#0a1f3a] p-4 flex gap-2 items-center">
              <KeyRound className="w-6 h-6 text-white" /> <h2 className="text-xl font-bold text-white">{t.changePassword}</h2>
            </div>
            <div className={`p-6 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <input type="password" value={currentPasswordInput} onChange={(e) => setCurrentPasswordInput(e.target.value)} placeholder={t.currentPassword} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} outline-none focus:border-blue-500`} />
              <input type="password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} placeholder={t.newPassword} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} outline-none focus:border-blue-500`} />
              <input type="password" value={confirmPasswordInput} onChange={(e) => setConfirmPasswordInput(e.target.value)} placeholder={t.confirmPassword} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} outline-none focus:border-blue-500`} />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowChangePasswordModal(false)} className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 transition-colors text-white rounded-lg cursor-pointer font-medium">{t.cancel}</button>
                <button onClick={() => setShowChangePasswordModal(false)} className="flex-1 py-3 bg-[#0c274b] hover:bg-blue-900 transition-colors text-white rounded-lg cursor-pointer font-medium">{t.savePassword}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}