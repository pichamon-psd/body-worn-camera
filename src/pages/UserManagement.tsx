import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { type User, initialUsersData } from '../data/userMockData';
import { UserManagementFilters } from '../components/ui/UserManagementFilters';

import { UserModal } from '../components/modals/UserModal'; 

interface UserManagementProps {
  darkMode: boolean;
  language: 'th' | 'en';
}

export function UserManagement({ darkMode, language }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const t: Record<string, Record<string, string>> = {
    th: { title: 'ผู้ใช้งาน', subtitle: 'จัดการผู้ใช้งาน (User Management)', listTitle: 'รายการผู้ใช้งาน', addUser: 'เพิ่มผู้ใช้งาน', search: 'ค้นหา', filterByRole: 'ตำแหน่ง', filterByStatus: 'สถานะ', reset: 'รีเซ็ต', tableNo: 'No.', tableUsername: 'ชื่อผู้ใช้', tableName: 'ชื่อ-สกุล', tableRole: 'ระดับความลับ', tableStatus: 'สถานะ', tableActions: 'เครื่องมือ', edit: 'แก้ไข', active: 'ใช้งาน', inactive: 'ยกเลิกการใช้งาน', allRoles: 'ทั้งหมด', allStatuses: 'ทั้งหมด', roleHigh: 'สูงสุด', roleMedium: 'สูง', roleLow: 'ปกติ', searchPlaceholder: 'ค้นหาชื่อผู้ใช้หรือนามสกุล...', showingItems: 'แสดงข้อมูลทั้งหมด', items: 'รายการ', itemsPerPage: 'แสดงต่อหน้า', previous: 'ก่อนหน้า', next: 'ถัดไป' },
    en: { title: 'Users', subtitle: 'User Management', listTitle: 'User List', addUser: 'Add User', search: 'Search', filterByRole: 'Role', filterByStatus: 'Status', reset: 'Reset', tableNo: 'No.', tableUsername: 'Username', tableName: 'Full Name', tableRole: 'Permission Level', tableStatus: 'Status', tableActions: 'Actions', edit: 'Edit', active: 'Active', inactive: 'Inactive', allRoles: 'All', allStatuses: 'All', roleHigh: 'Highest', roleMedium: 'High', roleLow: 'Normal', searchPlaceholder: 'Search username or name...', showingItems: 'Showing', items: 'items', itemsPerPage: 'Items per page', previous: 'Previous', next: 'Next' },
  };

  const translations = t[language];

  // Initialize users on mount and map correct translations
  useEffect(() => {
    if (users.length === 0) {
      setUsers(initialUsersData.map(u => ({
        ...u,
        role: u.roleLevel === 'high' ? translations.roleHigh : 
              u.roleLevel === 'medium' ? translations.roleMedium : 
              translations.roleLow
      })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); 

  const handleReset = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  const handleSaveUser = (user: User) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      setUsers([...users, user]);
    }
    setShowAddUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setEditingUser(null);
  };

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.roleLevel === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      if (startPage > 2) pages.push('...');
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : ''}`}>
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
              {translations.listTitle}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'th' 
                ? `แสดงข้อมูลทั้งหมด ${filteredUsers.length} รายการ`
                : `Showing ${filteredUsers.length} items`
              }
            </p>
          </div>
          
          {/* Add User Button */}
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-6 py-3 bg-green-500 hover:bg-[oklch(65%_0.24_149.579)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            {translations.addUser}
          </button>
        </div>
      </div>

      {/* Filters (แยก Component) */}
      <UserManagementFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onReset={handleReset}
        translations={translations}
        darkMode={darkMode}
      />

      {/* User Table */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-500 to-blue-600">
                <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10 w-16">{translations.tableNo}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableUsername}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableName}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableRole}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10">{translations.tableStatus}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white w-32">{translations.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">{language === 'th' ? 'ไม่พบข้อมูลผู้ใช้งาน' : 'No users found'}</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b transition-all hover:bg-opacity-50 ${
                      index % 2 === 0
                        ? darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'
                        : darkMode ? 'bg-gray-700/10 hover:bg-gray-700/30' : 'bg-gray-50 hover:bg-gray-100'
                    } ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    <td className={`px-4 py-4 text-center border-r ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className={`px-4 py-4 font-semibold border-r ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                      {user.username}
                    </td>
                    <td className={`px-4 py-4 border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                      {user.fullName}
                    </td>
                    <td className={`px-4 py-4 border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                      {user.role}
                    </td>
                    <td className={`px-4 py-4 text-center border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {user.status === 'active' ? translations.active : translations.inactive}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-center`}>
                      <button onClick={() => setEditingUser(user)} className="px-4 py-2 bg-linear-to-r from-[#fcd500] to-[#fed300] hover:from-[#fed300] hover:to-[#fcd500] text-[#0c274b] rounded-lg font-bold transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                        {translations.edit}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {translations.itemsPerPage}:
              </label>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page info */}
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'th'
                ? `แสดง ${filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} ถึง ${Math.min(indexOfLastItem, filteredUsers.length)} จาก ${filteredUsers.length} รายการ`
                : `Showing ${filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to ${Math.min(indexOfLastItem, filteredUsers.length)} of ${filteredUsers.length} items`
              }
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer'}`}>
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return <span key={`ellipsis-${index}`} className={`px-3 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>...</span>;
                }
                return (
                  <button key={page} onClick={() => handlePageChange(page as number)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${currentPage === page ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 font-bold' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}>
                    {page}
                  </button>
                );
              })}

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages || totalPages === 0} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage >= totalPages || totalPages === 0 ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer'}`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddUserModal && (
        <UserModal user={null} mode="add" darkMode={darkMode} language={language} onClose={() => setShowAddUserModal(false)} onSave={handleSaveUser} />
      )}
      {editingUser && (
        <UserModal user={editingUser} mode="edit" darkMode={darkMode} language={language} onClose={() => setEditingUser(null)} onSave={handleSaveUser} onDelete={handleDeleteUser} />
      )}
    </div>
  );
}