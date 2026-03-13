import { useState, useEffect } from 'react';
import { Calendar, Eye, Edit, Trash2, Clock, User, ChevronLeft, ChevronRight, Plus} from 'lucide-react';
import { type SpotCheckItem, initialSpotCheckData } from '../data/spotCheckMockData';
import { ViewModal, DeleteModal, ActionModal, SpotCheckFormModal, type SpotCheckFormData } from '../components/modals/SpotCheckModals';
import { SpotCheckFilters } from '../components/ui/SpotCheckFilters';

interface SpotCheckProps {
  darkMode: boolean;
  language: 'th' | 'en';
}

export function SpotCheck({ darkMode, language }: SpotCheckProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'start' | 'complete' | 'reject' | null>(null);
  const [selectedItem, setSelectedItem] = useState<SpotCheckItem | null>(null);
  
  const [copySuccess, setCopySuccess] = useState(false);
  const [spotCheckData, setSpotCheckData] = useState<SpotCheckItem[]>(initialSpotCheckData);

  const [formData, setFormData] = useState<SpotCheckFormData>({
    code: '', title: '', date: '', time: '', location: '', address: '', coordinates: '', officer: '', cameraId: '', priority: 'medium', duration: '', description: ''
  });

  const resetForm = () => {
    setFormData({ code: '', title: '', date: '', time: '', location: '', address: '', coordinates: '', officer: '', cameraId: '', priority: 'medium', duration: '', description: '' });
  };

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showModal || showViewModal || showEditModal || showDeleteModal || showActionModal) {
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
    }
  }, [showModal, showViewModal, showEditModal, showDeleteModal, showActionModal]);

  // Copy to clipboard function with fallback
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => { setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); },
        () => { fallbackCopyTextToClipboard(text); }
      );
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'accepted': return 'bg-[oklch(72.3%_0.219_149.579)] text-white border-[oklch(72.3%_0.219_149.579)]';
      case 'in-progress': return 'bg-blue-500 text-white border-blue-600';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-[oklch(85%_0.15_149.579)] text-[oklch(45%_0.25_149.579)]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  function convertToDate(dateStr: string): Date | null {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const filteredData = spotCheckData.filter((item) => {
    const matchesSearch = searchQuery === '' || item.code.toLowerCase().includes(searchQuery.toLowerCase()) || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase()) || item.officerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOfficer = selectedOfficer === 'all' || item.officer === selectedOfficer;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesReportType = selectedReportType === 'all' || item.reportType === selectedReportType;
    const itemDate = convertToDate(item.date);
    const matchesDateRange = (() => {
      if (!startDate && !endDate) return true;
      if (!itemDate) return true;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) return itemDate >= start && itemDate <= end;
      else if (start) return itemDate >= start;
      else if (end) return itemDate <= end;
      return true;
    })();
    return matchesSearch && matchesOfficer && matchesStatus && matchesReportType && matchesDateRange;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => { setCurrentPage(pageNumber); };

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

  // Handlers
  const handleEdit = (item: SpotCheckItem) => {
    setSelectedItem(item);
    setFormData({ code: item.code, title: item.title, date: item.date.split('/').reverse().join('-'), time: item.time, location: item.location, address: item.address, coordinates: item.coordinates, officer: item.officer, cameraId: item.cameraId, priority: item.priority, duration: item.duration || '', description: '' });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem = spotCheckData.find(item => item.id === selectedItem?.id);
    if (updatedItem) {
      Object.assign(updatedItem, formData);
      setSpotCheckData([...spotCheckData]);
    }
    setShowEditModal(false);
    setSelectedItem(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    resetForm();
  };

  const handleConfirmDelete = () => {
    setSpotCheckData(spotCheckData.filter(item => item.id !== selectedItem?.id));
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleConfirmAction = () => {
    if (!selectedItem || !actionType) return;
    const statusMapping: Record<'accept' | 'start' | 'complete' | 'reject', SpotCheckItem['status']> = {
        'accept': 'accepted',
        'start': 'in-progress',
        'complete': 'completed',
        'reject': 'cancelled'
    };
    
    setSpotCheckData(prevData => 
      prevData.map(item => {
        if (item.id === selectedItem.id) {
          const newStatus = statusMapping[actionType];
          return {
            ...item,
            status: newStatus,
            statusText: getStatusText(newStatus)
          };
        }
        return item;
      })
    );
    setShowActionModal(false);
    setActionType(null);
    if (showViewModal) {
      setShowViewModal(false);
      setSelectedItem(null);
    }
  };

  const getStatusText = (status: SpotCheckItem['status']) => {
    const statusMap = { 'waiting': language === 'th' ? 'รอรับงาน' : 'Waiting', 'accepted': language === 'th' ? 'รับงานแล้ว' : 'Accepted', 'in-progress': language === 'th' ? 'กำลังปฏิบัติงาน' : 'In Progress', 'completed': language === 'th' ? 'เสร็จสิ้น' : 'Completed', 'cancelled': language === 'th' ? 'ยกเลิก' : 'Cancelled' };
    return statusMap[status];
  };

  const translationsRecord: Record<string, Record<string, string>> = {
    th: { title: 'ขออกปฏิบัติงาน (Spot Check)', listTitle: 'รายการออกปฏิบัติงาน', filterDate: 'วันที่', filterOfficer: 'เจ้าหน้าที่', filterStatus: 'สถานะ', filterReportType: 'ประเภทรายงาน', searchPlaceholder: 'ค้นหา รหัส, สถานที่, เจ้าหน้าที่...', search: 'ค้นหา', reset: 'รีเซ็ต', tableNo: 'ลำดับ', tableCode: 'รหัส', tableTitle: 'หัวข้อ', tableStatus: 'สถานะ', tableDetails: 'รายละเอียด', tableOfficer: 'เจ้าหน้าที่', tableDateTime: 'วันที่-เวลา', tableActions: 'เครื่องมือ', statusWaiting: 'รอรับงาน', statusAccepted: 'รับงานแล้ว', statusInProgress: 'กำลังปฏิบัติงาน', statusCompleted: 'เสร็จสิ้น', statusCancelled: 'ยกเลิก', allOfficers: 'ทั้งหมด', allStatus: 'ทั้งหมด', allReportTypes: 'ทั้งหมด', reportTypeDaily: 'รายงานประจำวัน', reportTypeIncident: 'รายงานเหตุการณ์พิเศษ', reportTypeInspection: 'รายงานการตรวจสอบ', reportTypeTraining: 'รายงานการฝึกอบรม', date: 'วันที่', time: 'เวลา', location: 'สถานที่', responsible: 'ผู้รับผิดชอบ', camera: 'กล้อง', priority: 'ลำดับความสำคัญ', duration: 'ระยะเวลา', view: 'ดู', edit: 'แก้ไข', delete: 'ลบ', noData: 'ไม่พบข้อมูล', viewDetails: 'รายละเอียด', editRecord: 'แก้ไขรายการ', deleteConfirm: 'ยืนยันการลบ', deleteMessage: 'คุณแน่ใจหรือไม่ที่จะลบรายการนี้?', cancel: 'ยกเลิก', confirm: 'ยืนยัน', save: 'บันทึก', close: 'ปิด', acceptJob: 'รับงาน', startJob: 'เริ่มปฏิบัติงาน', completeJob: 'สิ้นสุดปฏิบัติงาน', rejectJob: 'ปฏิเสธ', backToMain: 'กลับหน้าหลัก', acceptJobConfirm: 'ยืนยันการรับงาน', startJobConfirm: 'ยืนยันการเริ่มปฏิบัติงาน', completeJobConfirm: 'ยืนยันการสิ้นสุดปฏิบัติงาน', rejectJobConfirm: 'ยืนยันการปฏิเสธงาน', acceptJobMessage: 'คุณต้องการรับงานนี้หรือไม่?', startJobMessage: 'คุณต้องการเริ่มปฏิบัติงานนี้หรือไม่?', completeJobMessage: 'คุณต้องการยืนยันว่างานนี้เสร็จสิ้นแล้วหรือไม่?', rejectJobMessage: 'คุณต้องการปฏิเสธงานนี้หรือไม่?' },
    en: { title: 'Spot Check Request', listTitle: 'Spot Check List', filterDate: 'Date', filterOfficer: 'Officer', filterStatus: 'Status', searchPlaceholder: 'Search code, location, officer...', search: 'Search', reset: 'Reset', tableNo: 'No.', tableCode: 'Code', tableTitle: 'Title', tableStatus: 'Status', tableDetails: 'Details', tableOfficer: 'Officer', tableDateTime: 'Date-Time', tableActions: 'Actions', statusWaiting: 'Waiting', statusAccepted: 'Accepted', statusInProgress: 'In Progress', statusCompleted: 'Completed', statusCancelled: 'Cancelled', allOfficers: 'All', allStatus: 'All', allReportTypes: 'All', reportTypeDaily: 'Daily Report', reportTypeIncident: 'Incident Report', reportTypeInspection: 'Inspection Report', reportTypeTraining: 'Training Report', date: 'Date', time: 'Time', location: 'Location', responsible: 'Responsible', camera: 'Camera', priority: 'Priority', duration: 'Duration', view: 'View', edit: 'Edit', delete: 'Delete', noData: 'No data found', viewDetails: 'View Details', editRecord: 'Edit Record', deleteConfirm: 'Confirm Delete', deleteMessage: 'Are you sure you want to delete this record?', cancel: 'Cancel', confirm: 'Confirm', save: 'Save', close: 'Close', acceptJob: 'Accept Job', startJob: 'Start Job', completeJob: 'Complete Job', rejectJob: 'Reject', backToMain: 'Back to Main', acceptJobConfirm: 'Confirm Accept Job', startJobConfirm: 'Confirm Start Job', completeJobConfirm: 'Confirm Complete Job', rejectJobConfirm: 'Confirm Reject Job', acceptJobMessage: 'Do you want to accept this job?', startJobMessage: 'Do you want to start this job?', completeJobMessage: 'Do you want to confirm that this job is completed?', rejectJobMessage: 'Do you want to reject this job?' }
  };
  const translations = translationsRecord[language];

  return (
    <div className="space-y-6">
      {/* List Title Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>{translations.listTitle}</h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? `แสดงข้อมูลทั้งหมด ${filteredData.length} รายการ` : `Showing ${filteredData.length} items`}</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <Plus className="w-5 h-5" /> 
            <span>{language === 'th' ? 'เพิ่มรายการออกปฏิบัติงาน' : 'Add Spot Check'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <SpotCheckFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedOfficer={selectedOfficer}
        setSelectedOfficer={setSelectedOfficer}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedReportType={selectedReportType} // ส่ง props เพิ่ม
        setSelectedReportType={setSelectedReportType} // ส่ง props เพิ่ม
        translations={translations}
        darkMode={darkMode}
        language={language}
        onReset={() => { 
          setSearchQuery(''); 
          setStartDate(''); 
          setEndDate(''); 
          setSelectedOfficer('all'); 
          setSelectedStatus('all'); 
          setSelectedReportType('all'); 
          setCurrentPage(1); 
        }}
      />

      {/* Desktop Table */}
      <div className={`hidden lg:block rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-500 to-blue-600">
                <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10 w-16">{translations.tableNo}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableCode}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableTitle}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10">{translations.tableStatus}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableDetails}</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white w-32">{translations.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center"><div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{translations.noData}</div></td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className={`border-b transition-all hover:bg-opacity-50 ${index % 2 === 0 ? darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50' : darkMode ? 'bg-gray-700/10 hover:bg-gray-700/30' : 'bg-gray-50 hover:bg-gray-100'} ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <td className={`px-4 py-4 text-center border-r ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600'}`}>{indexOfFirstItem + index + 1}</td>
                    <td className={`px-4 py-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="space-y-1">
                        <p className={`font-bold ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`}>{item.code}</p>
                        <div className="flex items-center gap-1.5 text-xs"><Clock className="w-3 h-3" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.time}</span></div>
                      </div>
                    </td>
                    <td className={`px-4 py-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="space-y-2">
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>{item.priority === 'high' ? 'สำคัญมาก' : item.priority === 'medium' ? 'ปานกลาง' : 'ปกติ'}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="flex justify-center"><span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusColor(item.status)}`}>{item.statusText}</span></div>
                    </td>
                    <td className={`px-4 py-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-start gap-2"><Calendar className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.date}</span></div>
                        <div className="flex items-start gap-2"><span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📍</span><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.location}</span></div>
                        <div className="flex items-center gap-2"><User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.officerName}</span></div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setSelectedItem(item); setShowViewModal(true); }} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-110" title={translations.view}><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(item)} className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-110" title={translations.edit}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedItem(item); setShowDeleteModal(true); }} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-110" title={translations.delete}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-1">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}><ChevronLeft className="w-4 h-4" /></button>
            {getPageNumbers().map((page, index) => {
              if (page === '...') return <span key={`ellipsis-${index}`} className={`px-3 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>...</span>;
              return <button key={page} onClick={() => handlePageChange(page as number)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}>{page}</button>;
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage >= totalPages ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {currentItems.length === 0 ? (
          <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}><div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{translations.noData}</div></div>
        ) : (
          currentItems.map((item) => (
            <div key={item.id} className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="bg-linear-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white font-bold text-lg">{item.code}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(item.status)}`}>{item.statusText}</span>
                    </div>
                    <p className="text-white/90 text-sm">{item.title}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.date} {item.time}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>{item.priority === 'high' ? 'สำคัญมาก' : item.priority === 'medium' ? 'ปานกลาง' : 'ปกติ'}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2"><span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📍</span><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.location}</span></div>
                  <div className="flex items-center gap-2"><User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.officerName}</span></div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => { setSelectedItem(item); setShowViewModal(true); }} className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all text-sm font-medium"><Eye className="w-4 h-4" /><span>{translations.view}</span></button>
                    <button onClick={() => handleEdit(item)} className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all text-sm font-medium"><Edit className="w-4 h-4" /><span>{translations.edit}</span></button>
                    <button onClick={() => { setSelectedItem(item); setShowDeleteModal(true); }} className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm font-medium"><Trash2 className="w-4 h-4" /><span>{translations.delete}</span></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {/* Mobile Pagination */}
        <div className={`rounded-xl shadow-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}><ChevronLeft className="w-4 h-4" /></button>
            {getPageNumbers().map((page, index) => {
              if (page === '...') return <span key={`ellipsis-${index}`} className={`px-3 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>...</span>;
              return <button key={page} onClick={() => handlePageChange(page as number)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}>{page}</button>;
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage >= totalPages ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <SpotCheckFormModal show={showModal} onClose={() => setShowModal(false)} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} translations={translations} language={language} darkMode={darkMode} isEdit={false} />
      <SpotCheckFormModal show={showEditModal} onClose={() => setShowEditModal(false)} formData={formData} setFormData={setFormData} onSubmit={handleEditSubmit} translations={translations} language={language} darkMode={darkMode} isEdit={true} />
      <ViewModal show={showViewModal} item={selectedItem} onClose={() => setShowViewModal(false)} translations={translations} language={language} darkMode={darkMode} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} copyToClipboard={copyToClipboard} copySuccess={copySuccess} handleAction={(type) => { setActionType(type); setShowActionModal(true); }} />
      <DeleteModal show={showDeleteModal} item={selectedItem} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} translations={translations} language={language} darkMode={darkMode} />
      <ActionModal show={showActionModal} item={selectedItem} actionType={actionType} onClose={() => setShowActionModal(false)} onConfirm={handleConfirmAction} translations={translations} language={language} darkMode={darkMode} />

    </div>
  );
}