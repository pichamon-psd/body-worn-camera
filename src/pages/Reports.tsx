import { useState } from 'react';
import { Calendar, ChevronDown, Search, FileText, Download, Eye, Filter, X, ChevronLeft, ChevronRight, Trash2, MoreVertical } from 'lucide-react';
import { type ReportItem, initialReportData } from '../data/reportMockData';
import { DeleteReportModal } from '../components/modals/ReportModals';
import { ReportDetailModal } from '../components/modals/ReportDetailModal'; 

interface ReportsProps {
  darkMode: boolean;
  language: 'th' | 'en';
}

export function Reports({ darkMode, language }: ReportsProps) {
  // --- States ---
  const [reports, setReports] = useState<ReportItem[]>(initialReportData);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('all');
  const [missionQuery, setMissionQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modals & Dropdowns
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // --- Translations (Strict Type) ---
  const t: Record<string, Record<string, string>> = {
    th: { title: 'รายงาน', listTitle: 'รายการรายงาน', filterDate: 'วันที่', filterOfficer: 'เจ้าหน้าที่', filterMission: 'ภารกิจ', filterStatus: 'สถานะ', search: 'ค้นหา', reset: 'รีเซ็ต', tableNo: 'No.', tableCode: 'เลขที่', tableDate: 'วันที่', tableOfficer: 'เจ้าหน้าที่', tableMission: 'ภารกิจ', tableUsageTime: 'เวลาที่ใช้งาน', tableStatus: 'สถานะ', tableActions: 'เครื่องมือ', viewDetails: 'ดูรายละเอียด', exportPDF: 'Export PDF', exportExcel: 'Export Excel', passed: 'ผ่าน', failed: 'ไม่ผ่าน', allOfficers: 'ทั้งหมด', allStatuses: 'ทั้งหมด', startDate: 'วันที่เริ่มต้น', endDate: 'วันที่สิ้นสุด', missionPlaceholder: 'ค้นหาภารกิจ...', showing: 'แสดง', to: 'ถึง', of: 'จาก', items: 'รายการ', itemsPerPage: 'แสดงต่อหน้า', noData: 'ไม่พบข้อมูล', noDataMessage: 'ไม่พบข้อมูลที่ตรงกับการค้นหา กรุณาลองใหม่อีกครั้ง', delete: 'ลบ', moreActions: 'เพิ่มเติม' },
    en: { title: 'Reports', listTitle: 'Report List', filterDate: 'Date', filterOfficer: 'Officer', filterMission: 'Mission', filterStatus: 'Spot-Check Status', search: 'Search', reset: 'Reset', tableNo: 'No.', tableCode: 'Code', tableDate: 'Date', tableOfficer: 'Officer', tableMission: 'Mission', tableUsageTime: 'Usage Time', tableStatus: 'Status', tableActions: 'Actions', viewDetails: 'View Details', exportPDF: 'Export PDF', exportExcel: 'Export Excel', passed: 'Passed', failed: 'Failed', allOfficers: 'All', allStatuses: 'All', startDate: 'Start Date', endDate: 'End Date', missionPlaceholder: 'Search mission...', showing: 'Showing', to: 'to', of: 'of', items: 'items', itemsPerPage: 'Items per page', noData: 'No Data', noDataMessage: 'No data found matching your search, please try again.', delete: 'Delete', moreActions: 'More Actions' }
  };
  const translations = t[language];

  // --- Filtering ---
  const filteredData = reports.filter((report) => {
    const matchesOfficer = selectedOfficer === 'all' || report.officerName === selectedOfficer;
    const matchesMission = report.mission.toLowerCase().includes(missionQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    // Date Logic can be added here if needed
    let matchesDate = true;
    if (startDate && endDate) matchesDate = true; 
    return matchesOfficer && matchesMission && matchesStatus && matchesDate;
  });

  // --- Pagination ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // --- Handlers ---
  const handlePageChange = (page: number) => setCurrentPage(page);
  
  const handleReset = () => {
    setStartDate(''); setEndDate(''); setSelectedOfficer('all'); setMissionQuery(''); setSelectedStatus('all'); setCurrentPage(1);
  };

  const handleExportPDF = (reportId: string) => console.log('Export PDF:', reportId);
  const handleExportExcel = (reportId: string) => console.log('Export Excel:', reportId);

  const handleViewDetails = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowModal(true);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReportToDelete(reportId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteReport = () => {
    if (reportToDelete) {
      setReports(prev => prev.filter(r => r.id !== reportToDelete));
      setReportToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>{translations.listTitle}</h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? `แสดงข้อมูลทั้งหมด ${filteredData.length} รายการ` : `Showing ${filteredData.length} items`}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.startDate}</label>
            <div className="relative">
              <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.endDate}</label>
            <div className="relative">
              <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.filterOfficer}</label>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} className={`w-full pl-10 pr-10 py-2.5 rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}>
                <option value="all">{translations.allOfficers}</option>
                <option value="สมชาย">ร.ต.อ. สมชาย</option>
                <option value="ท.วิจิตร">ส.ต. ท.วิจิตร</option>
                <option value="มนตรี">จ.ส.ต. มนตรี</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.filterStatus}</label>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={`w-full pl-10 pr-10 py-2.5 rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}>
                <option value="all">{translations.allStatuses}</option>
                <option value="passed">{translations.passed}</option>
                <option value="failed">{translations.failed}</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.filterMission}</label>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="text" value={missionQuery} onChange={(e) => setMissionQuery(e.target.value)} placeholder={translations.missionPlaceholder} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
            </div>
          </div>
          <div className="flex gap-3 md:items-end">
            <button onClick={handleReset} className={`px-6 py-2.5 rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
              <X className="w-5 h-5" /> <span>{translations.reset}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {filteredData.length === 0 ? (
          <div className={`p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <FileText className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{translations.noData}</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{translations.noDataMessage}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-blue-500 to-blue-600">
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10 w-16">{translations.tableNo}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableCode}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableDate}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableOfficer}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableMission}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableUsageTime}</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10">{translations.tableStatus}</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white w-24">{translations.tableActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((report, index) => (
                    <tr key={report.id} className={`border-b transition-all hover:bg-opacity-50 ${report.status === 'failed' ? darkMode ? 'bg-red-900/20 hover:bg-red-900/30' : 'bg-pink-100 hover:bg-pink-200' : index % 2 === 0 ? darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50' : darkMode ? 'bg-gray-700/10 hover:bg-gray-700/30' : 'bg-gray-50 hover:bg-gray-100'} ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <td className={`px-4 py-4 text-center border-r ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600'}`}>{startIndex + index + 1}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold border-r ${darkMode ? 'border-gray-600 text-[#fcd500]' : 'border-gray-200 text-[#0c274b]'}`}>{report.code}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'}`}>{report.date}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'}`}>{report.officer} {report.officerName}</td>
                      <td className={`px-4 py-4 text-sm border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'}`}>{report.mission}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'}`}>{report.usageTime}</td>
                      <td className={`px-4 py-4 text-center border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'failed' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                          {report.status === 'failed' ? translations.failed : translations.passed}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="relative inline-block">
                          <button onClick={() => setOpenDropdown(openDropdown === report.id ? null : report.id)} className={`p-2 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`} title={translations.moreActions}>
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openDropdown === report.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)}></div>
                              <div className={`absolute right-0 w-48 rounded-xl shadow-2xl z-20 border overflow-hidden ${index >= currentData.length - 3 ? 'bottom-full mb-2' : 'mt-2'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <button onClick={() => { handleViewDetails(report.id); setOpenDropdown(null); }} className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 transition-all ${darkMode ? 'hover:bg-blue-600 text-gray-200 hover:text-white' : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'}`}>
                                  <Eye className="w-4 h-4" />{translations.viewDetails}
                                </button>
                                <button onClick={() => { handleExportPDF(report.id); setOpenDropdown(null); }} className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 transition-all border-t ${darkMode ? 'hover:bg-red-600 text-gray-200 hover:text-white border-gray-700' : 'hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-100'}`}>
                                  <FileText className="w-4 h-4" />{translations.exportPDF}
                                </button>
                                <button onClick={() => { handleExportExcel(report.id); setOpenDropdown(null); }} className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 transition-all border-t ${darkMode ? 'hover:bg-[oklch(65%_0.24_149.579)] text-gray-200 hover:text-white border-gray-700' : 'hover:bg-[oklch(90%_0.1_149.579)] text-gray-700 hover:text-[oklch(45%_0.25_149.579)] border-gray-100'}`}>
                                  <Download className="w-4 h-4" />{translations.exportExcel}
                                </button>
                                <button onClick={() => { handleDeleteReport(report.id); setOpenDropdown(null); }} className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 transition-all border-t ${darkMode ? 'hover:bg-red-600 text-gray-200 hover:text-white border-gray-700' : 'hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-100'}`}>
                                  <Trash2 className="w-4 h-4" />{translations.delete}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((report) => (
                <div key={report.id} className={`p-4 ${report.status === 'failed' ? darkMode ? 'bg-red-900/20' : 'bg-pink-100' : darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-bold ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`}>{report.code}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.status === 'failed' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                          {report.status === 'failed' ? translations.failed : translations.passed}
                        </span>
                      </div>
                      <div className={`text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{report.mission}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{report.officer} {report.officerName}</div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{report.date} • {report.usageTime}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleViewDetails(report.id)} className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"><Eye className="w-4 h-4" /><span className="text-xs">{translations.viewDetails}</span></button>
                    <button onClick={() => handleExportPDF(report.id)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"><span className="text-xs">PDF</span></button>
                    <button onClick={() => handleExportExcel(report.id)} className="px-4 py-2 bg-green-500 hover:bg-[oklch(65%_0.24_149.579)] text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"><span className="text-xs">Excel</span></button>
                    <button onClick={() => handleDeleteReport(report.id)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.itemsPerPage}:</label>
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className={`px-3 py-1.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50`}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.showing} {startIndex + 1} {translations.to} {Math.min(endIndex, filteredData.length)} {translations.of} {filteredData.length} {translations.items}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}><ChevronLeft className="w-4 h-4" /></button>
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') return <span key={`ellipsis-${index}`} className={`px-3 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>...</span>;
                    return (
                      <button 
                        key={page} 
                        onClick={() => handlePageChange(page as number)} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page 
                            ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700' 
                            : darkMode 
                              ? 'bg-gray-700 text-white hover:bg-gray-600' 
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage >= totalPages ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- Modals --- */}
      <DeleteReportModal show={showDeleteConfirm} reportId={reportToDelete} onClose={() => setShowDeleteConfirm(false)} onConfirm={confirmDeleteReport} language={language} darkMode={darkMode} />
      
      {showModal && selectedReport && (
        <ReportDetailModal report={selectedReport} darkMode={darkMode} language={language} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}