import { useState } from 'react';
import { Calendar, ChevronDown, Search, Play, Archive, X, User, Video, ChevronLeft, ChevronRight, MapPin, AlertTriangle } from 'lucide-react';
import { type VideoItem, initialVideoData } from '../data/videoLibraryMockData';
import { VideoLibraryModal } from '../components/modals/VideoLibraryModal';

interface VideoLibraryProps {
  darkMode: boolean;
  language: 'th' | 'en';
}

export function VideoLibrary({ darkMode, language }: VideoLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('all');
  const [selectedSpotCheck, setSelectedSpotCheck] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideoData);

  const t: Record<string, Record<string, string>> = {
    th: { title: 'คลังวิดีโอ', listTitle: 'รายการวิดีโอ', filterDate: 'วันที่', filterOfficer: 'เจ้าหน้าที่', filterSpotCheck: 'Spot Check', filterEvent: 'เหตุการณ์', searchPlaceholder: 'ค้นหา รหัส, เจ้าหน้าที่, สถานที่...', search: 'ค้นหา', reset: 'รีเซ็ต', tableNo: 'ลำดับ', tableCode: 'รหัส', tableTitle: 'รายการ', tableOfficer: 'เจ้าหน้าที่', tableStatus: 'สถานะ', tableActions: 'เครื่องมือ', play: 'เล่น', archive: 'จัดเก็บ', archived: 'จัดเก็บแล้ว', download: 'ดาวน์โหลด', close: 'ปิด', aiAlert: 'เตือนจาก AI', normal: 'ปกติ', allOfficers: 'ทั้งหมด', allSpotChecks: 'ทั้งหมด', allEvents: 'ทั้งหมด', videoDetails: 'รายละเอียดวิดีโอ', location: 'สถานที่', dateTime: 'วันที่-เวลา', duration: 'ระยะเวลา', itemsPerPage: 'แสดงต่อหน้า', showing: 'แสดง', of: 'จาก', items: 'รายการ', to: 'ถึง', startDate: 'วันที่เริ่มต้น', endDate: 'วันที่สิ้นสุด', noData: 'ไม่พบข้อมูล', noDataMessage: 'ไม่พบข้อมูลที่ตรงกับการค้นหา กรุณาลองใหม่อีกครั้ง', additionalInfo: 'ข้อมูลกำกับ', mission: 'ภารกิจ', time: 'เวลา', usageLog: 'บันทึกการใช้งาน', viewedBy: 'เปิดดูโดย', sendCase: 'ส่งออก', backToMain: 'กลับหน้าหลัก' },
    en: { title: 'Video Library', listTitle: 'Video List', filterDate: 'Date', filterOfficer: 'Officer', filterSpotCheck: 'Spot Check', filterEvent: 'Event', searchPlaceholder: 'Search code, officer, location...', search: 'Search', reset: 'Reset', tableNo: 'No.', tableCode: 'Code', tableTitle: 'Title', tableOfficer: 'Officer', tableStatus: 'Status', tableActions: 'Actions', play: 'Play', archive: 'Archive', archived: 'Archived', download: 'Download', close: 'Close', aiAlert: 'AI Alert', normal: 'Normal', allOfficers: 'All', allSpotChecks: 'All', allEvents: 'All', videoDetails: 'Video Details', location: 'Location', dateTime: 'Date-Time', duration: 'Duration', itemsPerPage: 'Items per page', showing: 'Showing', of: 'of', items: 'items', to: 'to', startDate: 'Start Date', endDate: 'End Date', noData: 'No Data', noDataMessage: 'No data found matching your search, please try again.', additionalInfo: 'Additional Information', mission: 'Mission', time: 'Time', usageLog: 'Usage Log', viewedBy: 'Viewed by', sendCase: 'Send Case', backToMain: 'Back to Main' },
  };

  const translations = t[language];

  // Map Data Text Language
  const mappedVideos = videos.map(v => ({
    ...v,
    statusText: v.status === 'ai-alert' ? translations.aiAlert : translations.normal
  }));

  // Filter data
  const filteredData = mappedVideos.filter((video) => {
    const matchesSearch = video.code.toLowerCase().includes(searchQuery.toLowerCase()) || video.title.toLowerCase().includes(searchQuery.toLowerCase()) || video.officerName.toLowerCase().includes(searchQuery.toLowerCase()) || video.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOfficer = selectedOfficer === 'all' || video.officerName === selectedOfficer;
    const matchesSpotCheck = selectedSpotCheck === 'all' || video.code === selectedSpotCheck;
    const matchesEvent = selectedEvent === 'all' || video.status === selectedEvent;
    
    let matchesDate = true;
    if (startDate && endDate) {
      const videoDate = new Date(video.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesDate = videoDate >= start && videoDate <= end;
    }
    return matchesSearch && matchesOfficer && matchesSpotCheck && matchesEvent && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePlayVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleArchiveVideo = (videoId: string) => {
    setVideos(videos.map(v => v.id === videoId ? { ...v, isArchived: !v.isArchived } : v));
    // ถ้ากำลังเปิด Modal อยู่แล้วกด Archive ให้มันอัปเดต state ตัวที่เลือกด้วย
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo({ ...selectedVideo, isArchived: !selectedVideo.isArchived });
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
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
              {translations.listTitle}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'th' ? `แสดงข้อมูลทั้งหมด ${filteredData.length} รายการ` : `Showing ${filteredData.length} items`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} className={`w-full pl-10 pr-10 py-2.5 rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}>
                <option value="all">{translations.allOfficers}</option>
                <option value="สมชาย">ร.อ.อ. สมชาย</option>
                <option value="วิจิตร">พ.ต.ท. วิจิตร</option>
                <option value="มนตรี">จ.ส.ท. มนตรี</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.filterSpotCheck}</label>
            <div className="relative">
              <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select value={selectedSpotCheck} onChange={(e) => setSelectedSpotCheck(e.target.value)} className={`w-full pl-10 pr-10 py-2.5 rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}>
                <option value="all">{translations.allSpotChecks}</option>
                <option value="SC-001">SC-001</option>
                <option value="SC-002">SC-002</option>
                <option value="SC-003">SC-003</option>
                <option value="SC-004">SC-004</option>
                <option value="SC-005">SC-005</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.filterEvent}</label>
            <div className="relative">
              <AlertTriangle className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className={`w-full pl-10 pr-10 py-2.5 rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}>
                <option value="all">{translations.allEvents}</option>
                <option value="ai-alert">{translations.aiAlert}</option>
                <option value="normal">{translations.normal}</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={translations.searchPlaceholder} className={`w-full pl-12 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
          </div>
          <button onClick={() => { setSearchQuery(''); setStartDate(''); setEndDate(''); setSelectedOfficer('all'); setSelectedSpotCheck('all'); setSelectedEvent('all'); setCurrentPage(1); }} className={`px-6 py-3 rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}>
            <X className="w-5 h-5" />
            <span>{translations.reset}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {filteredData.length === 0 ? (
          <div className={`p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Video className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{translations.noData}</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{translations.noDataMessage}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-blue-500 to-blue-600">
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10 w-16">{translations.tableNo}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableCode}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableTitle}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10">{translations.tableOfficer}</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-white/10">{translations.tableStatus}</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-white w-56">{translations.tableActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((video, index) => (
                    <tr key={video.id} className={`border-b transition-all hover:bg-opacity-50 ${index % 2 === 0 ? darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50' : darkMode ? 'bg-gray-700/10 hover:bg-gray-700/30' : 'bg-gray-50 hover:bg-gray-100'} ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <td className={`px-4 py-4 text-center border-r ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                        {startIndex + index + 1}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold border-r ${darkMode ? 'border-gray-600 text-[#fcd500]' : 'border-gray-200 text-[#0c274b]'}`}>
                        {video.code}
                      </td>
                      <td className={`px-4 py-4 text-sm border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'}`}>
                        <div>
                          <div className="font-medium">{video.title}</div>
                          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {video.date} {video.time} • {video.duration}
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm border-r ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-900'}`}>
                        {video.officer} {video.officerName}
                      </td>
                      <td className={`px-4 py-4 text-center border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${video.status === 'ai-alert' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                          {video.statusText}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handlePlayVideo(video)} className="px-4 py-2 bg-linear-to-r from-[#fcd500] to-[#fed300] hover:from-[#fed300] hover:to-[#fcd500] text-[#0c274b] rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer">
                            <Play className="w-4 h-4" />
                            <span>{translations.play}</span>
                          </button>
                          <button onClick={() => handleArchiveVideo(video.id)} className={`px-4 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer ${video.isArchived ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                            <Archive className="w-4 h-4" />
                            <span>{video.isArchived ? translations.archived : translations.archive}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((video) => (
                <div key={video.id} className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-bold ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`}>{video.code}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${video.status === 'ai-alert' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                          {video.statusText}
                        </span>
                      </div>
                      <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{video.title}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{video.officer} {video.officerName}</div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{video.date} {video.time} • {video.duration}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handlePlayVideo(video)} className="flex-1 px-4 py-2 bg-linear-to-r from-[#fcd500] to-[#fed300] hover:from-[#fed300] hover:to-[#fcd500] text-[#0c274b] rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                      <Play className="w-4 h-4" /><span>{translations.play}</span>
                    </button>
                    <button onClick={() => handleArchiveVideo(video.id)} className={`flex-1 px-4 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer ${video.isArchived ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                      <Archive className="w-4 h-4" /><span>{video.isArchived ? translations.archived : translations.archive}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.itemsPerPage}:</label>
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className={`px-3 py-1.5 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 cursor-pointer`}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {translations.showing} {startIndex + 1} {translations.to} {Math.min(endIndex, filteredData.length)} {translations.of} {filteredData.length} {translations.items}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer'}`}><ChevronLeft className="w-4 h-4" /></button>
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') return <span key={`ellipsis-${index}`} className={`px-3 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>...</span>;
                    return <button key={page} onClick={() => handlePageChange(page as number)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${currentPage === page ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}>{page}</button>;
                  })}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage >= totalPages ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer'}`}><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- External Modal --- */}
      <VideoLibraryModal 
        show={showVideoModal} 
        video={selectedVideo} 
        onClose={() => setShowVideoModal(false)} 
        onArchive={handleArchiveVideo} 
        translations={translations} 
        language={language} 
        darkMode={darkMode} 
      />

    </div>
  );
}