import { useState, useEffect } from 'react';
import { X, User as UserIcon, Save, Trash2, AlertTriangle } from 'lucide-react';
import type { User } from '../../data/userMockData';

interface UserModalProps {
  user: User | null;
  mode: 'add' | 'edit';
  darkMode: boolean;
  language: 'th' | 'en';
  onClose: () => void;
  onSave: (user: User) => void;
  onDelete?: (userId: string) => void;
}

export function UserModal({ user, mode, darkMode, language, onClose, onSave, onDelete }: UserModalProps) {
  const [formData, setFormData] = useState<User>(
    user || {
      id: '',
      username: '',
      fullName: '',
      role: '',
      roleLevel: 'low',
      status: 'active',
      department: '',
    }
  );
  
  const [password, setPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [permissions, setPermissions] = useState({
    dashboard: false,
    spotCheck: false,
    live: false,
    video: false,
    reports: false,
    users: false,
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const t: Record<string, Record<string, string>> = {
    th: {
      addUser: 'เพิ่มผู้ใช้งานใหม่',
      editUser: 'แก้ไขผู้ใช้งาน',
      username: 'ชื่อผู้ใช้ (Username)', 
      fullName: 'ชื่อ-นามสกุล',
      password: 'รหัสผ่าน Password',
      role: 'บทบาท (Role)',
      roleUser: 'ผู้ใช้งาน',
      roleAdmin: 'ผู้ดูแลระบบ',
      roleOfficer: 'เจ้าหน้าที่',
      roleSupervisor: 'หัวหน้า',
      department: 'หน่วยงาน / สังกัด',
      security: 'ระดับความลับ',
      securityHigh: 'สูง',
      securityMedium: 'ปานกลาง',
      securityNormal: 'ปกติ',
      securityLow: 'ต่ำ',
      permissions: 'สิทธิ์การเข้าถึงระบบ',
      permDashboard: 'Dashboard',
      permSpotCheck: 'Spot Check',
      permLive: 'Live',
      permVideo: 'วีดีโอ',
      permReports: 'รายงาน',
      permUsers: 'ผู้ใช้งาน',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      backToMain: 'กลับหน้าหลัก', 
      delete: 'ลบผู้ใช้งาน',
      deleteConfirmTitle: 'ยืนยันการลบผู้ใช้งาน',
      deleteConfirmMessage: 'คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งานนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
      confirmDelete: 'ยืนยันการลบ',
    },
    en: {
      addUser: 'Add New User',
      editUser: 'Edit User',
      username: 'Username',
      fullName: 'Full Name',
      password: 'Password',
      role: 'Role',
      roleUser: 'User',
      roleAdmin: 'Admin',
      roleOfficer: 'Officer',
      roleSupervisor: 'Supervisor',
      department: 'Department',
      security: 'Security Level',
      securityHigh: 'High',
      securityMedium: 'Medium',
      securityNormal: 'Normal',
      securityLow: 'Low',
      permissions: 'System Access Permissions',
      permDashboard: 'Dashboard',
      permSpotCheck: 'Spot Check',
      permLive: 'Live',
      permVideo: 'Video',
      permReports: 'Reports',
      permUsers: 'Users',
      save: 'Save',
      cancel: 'Cancel',
      backToMain: 'Back to Main',
      delete: 'Delete User',
      deleteConfirmTitle: 'Confirm Delete',
      deleteConfirmMessage: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmDelete: 'Confirm Delete',
    },
  };

  const translations = t[language];

  const handleSave = () => {
    const roleText = 
      formData.roleLevel === 'high' ? translations.roleAdmin :
      formData.roleLevel === 'medium' ? translations.roleSupervisor :
      translations.roleUser;

    onSave({
      ...formData,
      role: roleText,
      id: formData.id || `user_${Date.now()}`,
    });
    onClose();
  };

  // ฟังก์ชันนี้จะถูกเรียกใช้ตอนกดยืนยันการลบ
  const handleDelete = () => {
    if (onDelete && formData.id) {
      onDelete(formData.id);
      onClose();
    }
  };

  const handlePermissionChange = (permission: keyof typeof permissions, checked: boolean) => {
    setPermissions({
      ...permissions,
      [permission]: checked,
    });
  };

  // ==========================================
  // Render: โหมดแก้ไข (Edit Mode)
  // ==========================================
  if (mode === 'edit') {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-slideUp ${
            darkMode ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white'
          }`}>
            {/* Header */}
            <div className="relative bg-linear-to-r from-[#0c274b] via-[#0c274b] to-[#0a1f3a] px-8 py-6 border-b-4 border-[#fcd500]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-linear-to-br from-[#fcd500] to-[#fed300] p-3 rounded-xl shadow-lg">
                    <UserIcon className="w-8 h-8 text-[#0c274b]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {translations.editUser}
                    </h2>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-all p-2.5 hover:bg-white/10 rounded-xl group cursor-pointer"
                >
                  <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className={`p-8 space-y-6 max-h-[60vh] overflow-y-auto ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className="space-y-5">
                {/* Username Display */}
                <div>
                  <label className={`block font-semibold text-base mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.username} : {formData.username}
                  </label>
                </div>

                {/* Role Dropdown */}
                <div>
                  <label className={`block font-semibold text-base mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.role} :
                  </label>
                  <select
                    value={formData.roleLevel}
                    onChange={(e) => setFormData({ ...formData, roleLevel: e.target.value as 'high' | 'medium' | 'low' })}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 cursor-pointer ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'
                    }`}
                  >
                    <option value="low">{translations.roleUser}</option>
                    <option value="medium">{translations.roleSupervisor}</option>
                    <option value="normal">{translations.roleOfficer}</option>
                    <option value="high">{translations.roleAdmin}</option>
                  </select>
                </div>

                {/* Security Level */}
                <div>
                  <label className={`block font-semibold text-base mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.security} :
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 cursor-pointer ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'
                    }`}
                  >
                    <option value="active">{translations.securityNormal}</option>
                    <option value="inactive">{translations.securityMedium}</option>
                  </select>
                </div>

                {/* Permissions */}
                <div>
                  <label className={`block font-semibold text-base mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.permissions}
                  </label>
                  <div className="space-y-2">
                    {Object.keys(permissions).map((key) => {
                      const permKey = key as keyof typeof permissions;
                      const labelKey = `perm${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof translations;
                      return (
                        <label key={key} className={`flex items-center gap-3 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <input
                            type="checkbox"
                            checked={permissions[permKey]}
                            onChange={(e) => handlePermissionChange(permKey, e.target.checked)}
                            className="w-5 h-5 text-[#fcd500] border-2 rounded focus:ring-2 focus:ring-[#fcd500]/50 cursor-pointer"
                          />
                          <span>{translations[labelKey] || key}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer ปรับปรุงใหม่: แบ่งฝั่งซ้าย (ปุ่มลบ) และ ขวา (ปุ่มยกเลิก, บันทึก) */}
            <div className={`px-8 py-6 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
            }`}>
              
              {/* ปุ่มลบผู้ใช้งาน (ฝั่งซ้าย) */}
              {onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                  {translations.delete}
                </button>
              )}

              {/* ปุ่มยกเลิก และ บันทึก (ฝั่งขวา) */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {translations.cancel}
                </button>

                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-[oklch(65%_0.24_149.579)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  {translations.save}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* เพิ่มหน้าต่างยืนยันการลบ (Delete Confirmation Modal) */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-slideUp ${
              darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
            }`}>
              <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">{translations.deleteConfirmTitle}</h2>
              </div>
              <div className={`p-6 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {translations.deleteConfirmMessage}
                </p>
                <div className={`p-3 rounded-lg border-l-4 border-red-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.username}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formData.fullName}</p>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                      darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {translations.cancel}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    {translations.confirmDelete}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
          .animate-slideUp { animation: slideUp 0.3s ease-out; }
        `}</style>
      </>
    );
  }

  // ==========================================
  // Render: โหมดเพิ่มผู้ใช้ (Add Mode) - เหมือนเดิม
  // ==========================================
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
        <div className={`w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-slideUp ${
          darkMode ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white'
        }`}>
          {/* Header */}
          <div className="relative bg-linear-to-r from-[#0c274b] via-[#0c274b] to-[#0a1f3a] px-8 py-6 border-b-4 border-[#fcd500]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-[#fcd500] to-[#fed300] p-3 rounded-xl shadow-lg">
                  <UserIcon className="w-8 h-8 text-[#0c274b]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {translations.addUser}
                  </h2>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-all p-2.5 hover:bg-white/10 rounded-xl group cursor-pointer"
              >
                <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`p-8 space-y-6 max-h-[70vh] overflow-y-auto ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className={`block font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.username} <span className="text-[#fcd500]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#0c274b]'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.fullName} <span className="text-[#fcd500]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#0c274b]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {translations.password} <span className="text-[#fcd500]">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#0c274b]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className={`block font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.department} <span className="text-[#fcd500]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#0c274b]'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {translations.role} <span className="text-[#fcd500]">*</span>
                  </label>
                  <select
                    value={formData.roleLevel}
                    onChange={(e) => setFormData({ ...formData, roleLevel: e.target.value as 'high' | 'medium' | 'low' })}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 cursor-pointer ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'
                    }`}
                  >
                    <option value="low">{translations.roleUser}</option>
                    <option value="medium">{translations.roleSupervisor}</option>
                    <option value="high">{translations.roleAdmin}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {translations.security} <span className="text-[#fcd500]">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 hover:border-[#fcd500]/50 cursor-pointer ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'
                  }`}
                >
                  <option value="active">{translations.securityHigh}</option>
                  <option value="inactive">{translations.securityMedium}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-8 py-6 border-t-2 flex items-center justify-end gap-3 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className={`px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {translations.cancel}
            </button>

            <button
              onClick={handleSave}
              className="px-8 py-3 bg-green-500 hover:bg-[oklch(65%_0.24_149.579)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105 cursor-pointer"
            >
              <Save className="w-5 h-5" />
              {translations.save}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}