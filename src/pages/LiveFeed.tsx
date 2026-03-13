import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Circle, MapPin, User, Video, Calendar, Radio } from 'lucide-react';
import { type LiveFeedItem, allLiveFeedData } from '../data/liveFeedMockData';
import { LiveFeedVideoModal, LiveFeedDetailsModal, type TranslationsType } from '../components/modals/LiveFeedModals';

interface LiveFeedProps {
  darkMode: boolean;
  language: 'th' | 'en';
}

export function LiveFeed({ darkMode, language }: LiveFeedProps) {
  const [selectedFeed, setSelectedFeed] = useState<LiveFeedItem | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const t: Record<string, TranslationsType> = {
    th: {
      title: 'ภาพสด',
      subtitle: 'รายการภาพสดและควบคุมการเชื่อมต่อกล้องวีดีโอ',
      tableCode: 'รายการ',
      tableStatus: 'สถานะ',
      tableTools: 'เครื่องมือ',
      statusActive: 'กำลังดำเนินการ',
      statusWaiting: 'รอดำเนินการ',
      statusOffline: 'ออฟไลน์',
      connect: 'เชื่อมต่อ',
      disconnect: 'ตัดการเชื่อมต่อ',
      viewLive: 'ดูภาพสด',
      noData: 'ไม่พบข้อมูล',
      liveStream: 'ภาพสดจากกล้อง',
      close: 'ปิด',
      officer: 'เจ้าหน้าที่',
      location: 'สถานที่',
      camera: 'กล้อง',
      date: 'วันที่',
      time: 'เวลา',
      live: 'สด',
      play: 'เล่น',
      pause: 'หยุด',
      mute: 'ปิดเสียง',
      unmute: 'เปิดเสียง',
      fullscreen: 'เต็มจอ',
      detailsTitle: 'รายการกล้องที่คัดและสามารถเปิดได้',
      detailsOfficer: 'เจ้าหน้าที่ :',
      detailsTask: 'ภารกิจ :',
      detailsRecordStatus: 'สถานการณ์บันทึก :',
      detailsRecording: 'กำลังบันทึก',
      detailsUsageLog: 'บันทึกการใช้งาน :',
      detailsOpenedBy: 'เปิดคู่โดย',
      detailsTime: 'เวลา',
      backToMain: 'กลับหน้าหลัก',
      cameraFeed: 'ภาพจากกล้อง',
    },
    en: {
      title: 'Live Feed',
      subtitle: 'Live feed and video camera connection control',
      tableCode: 'Code',
      tableStatus: 'Status',
      tableTools: 'Tools',
      statusActive: 'Active',
      statusWaiting: 'Waiting',
      statusOffline: 'Offline',
      connect: 'Connect',
      disconnect: 'Disconnect',
      viewLive: 'View Live',
      noData: 'No data found',
      liveStream: 'Live Camera Feed',
      close: 'Close',
      officer: 'Officer',
      location: 'Location',
      camera: 'Camera',
      date: 'Date',
      time: 'Time',
      live: 'Live',
      play: 'Play',
      pause: 'Pause',
      mute: 'Mute',
      unmute: 'Unmute',
      fullscreen: 'Fullscreen',
      detailsTitle: 'Available Camera List',
      detailsOfficer: 'Officer :',
      detailsTask: 'Task :',
      detailsRecordStatus: 'Recording Status :',
      detailsRecording: 'Recording',
      detailsUsageLog: 'Usage Log :',
      detailsOpenedBy: 'Opened by',
      detailsTime: 'at',
      backToMain: 'Back to Main',
      cameraFeed: 'Camera Feed',
    },
  };

  const translations = t[language];

  // Map status text securely
  const liveFeedData = allLiveFeedData.map(item => ({
    ...item,
    statusText: item.status === 'active' ? translations.statusActive : 
                item.status === 'waiting' ? translations.statusWaiting : 
                translations.statusOffline
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[oklch(72.3%_0.219_149.579)] text-white border-[oklch(72.3%_0.219_149.579)]';
      case 'waiting': return 'bg-[oklch(72.3%_0.219_149.579)] text-white border-[oklch(72.3%_0.219_149.579)]'; // สีอิงตามต้นฉบับ
      case 'offline': return 'bg-gray-500 text-white border-gray-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const handleConnect = (item: LiveFeedItem) => {
    setSelectedFeed(item);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowVideoModal(false);
    setSelectedFeed(null);
    setIsPlaying(false);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedFeed(null);
  };

  const handleOpenVideo = () => {
    setShowDetailsModal(false);
    setShowVideoModal(true);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showDetailsModal || showVideoModal) {
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
  }, [showDetailsModal, showVideoModal]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
              {translations.title}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {translations.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="font-bold">{translations.live}</span>
          </div>
        </div>
      </div>

      {/* Live Feed Table - Desktop */}
      <div className={`hidden lg:block rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-500 to-blue-600">
                <th className="px-6 py-3 text-left text-sm font-semibold text-white border-r border-white/10">
                  {translations.tableCode}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-white border-r border-white/10">
                  {translations.tableStatus}
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-white">
                  {translations.tableTools}
                </th>
              </tr>
            </thead>
            <tbody>
              {liveFeedData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {translations.noData}
                    </div>
                  </td>
                </tr>
              ) : (
                liveFeedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b transition-all hover:bg-opacity-50 ${
                      index % 2 === 0
                        ? darkMode
                          ? 'bg-gray-700/30 hover:bg-gray-700/50'
                          : 'bg-white hover:bg-gray-50'
                        : darkMode
                          ? 'bg-gray-700/10 hover:bg-gray-700/30'
                          : 'bg-gray-50 hover:bg-gray-100'
                    } ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    <td className={`px-6 py-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-lg ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`}>
                            {item.code}
                          </p>
                          {item.isLive && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                              <Circle className="w-2 h-2 fill-white animate-pulse" />
                              {translations.live}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.title}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {item.officerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {item.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Video className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {language === 'th' ? 'กล้อง' : 'Camera'} {item.cameraId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className={`px-6 py-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${getStatusColor(item.status)}`}>
                          {item.statusText}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleConnect(item)}
                          className="px-6 py-2 bg-linear-to-r from-[#fcd500] to-[#fed300] hover:from-[#fed300] hover:to-[#fcd500] text-[#0c274b] font-bold rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer"
                        >
                          {item.isLive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                          <span>{translations.connect}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {liveFeedData.length === 0 ? (
          <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {translations.noData}
            </div>
          </div>
        ) : (
          liveFeedData.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="bg-linear-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-white font-bold text-lg">{item.code}</span>
                      {item.isLive && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
                          <Circle className="w-2 h-2 fill-white" /> {translations.live}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold border ml-auto ${getStatusColor(item.status)}`}>
                        {item.statusText}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm">{item.title}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item.officerName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Video className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {language === 'th' ? 'กล้อง' : 'Camera'} {item.cameraId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item.date} {item.time}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleConnect(item)}
                    className="w-full px-4 py-2.5 bg-linear-to-r from-[#fcd500] to-[#fed300] hover:from-[#fed300] hover:to-[#fcd500] text-[#0c274b] font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {item.isLive ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                    <span>{translations.connect}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Modals --- */}
      <LiveFeedDetailsModal 
        show={showDetailsModal} 
        feed={selectedFeed} 
        onClose={handleCloseDetailsModal} 
        onOpenVideo={handleOpenVideo} 
        getStatusColor={getStatusColor} 
        translations={translations} 
        language={language} 
        darkMode={darkMode} 
      />
      <LiveFeedVideoModal 
        show={showVideoModal} 
        feed={selectedFeed} 
        onClose={handleCloseModal} 
        translations={translations} 
        language={language} 
        isPlaying={isPlaying} 
        isMuted={isMuted} 
        togglePlay={togglePlay} 
        toggleMute={toggleMute} 
      />
      
    </div>
  );
}