import { useEffect } from 'react';
import { X, Play, Archive, Download, Clock, User, MapPin, AlertTriangle, Video, FileText } from 'lucide-react';
import type { VideoItem } from '../../data/videoLibraryMockData';

interface VideoLibraryModalProps {
  show: boolean;
  video: VideoItem | null;
  onClose: () => void;
  onArchive: (id: string) => void;
  translations: Record<string, string>;
  language: 'th' | 'en';
  darkMode: boolean;
}

export function VideoLibraryModal({ show, video, onClose, onArchive, translations, language, darkMode }: VideoLibraryModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (show) {
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
  }, [show]);

  if (!show || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className={`w-full max-w-7xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header - Fixed */}
        <div className="bg-linear-to-r from-[#0c274b] to-[#0c274b]/90 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#fcd500] p-2 rounded-lg">
              <Video className="w-6 h-6 text-[#0c274b]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{video.code}</h2>
              <p className="text-sm text-gray-300">{video.title}</p>
            </div>
            <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${
              video.status === 'ai-alert' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {video.statusText}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Video Details (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player */}
                <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className="bg-black aspect-video flex items-center justify-center relative group">
                    <div className="text-center">
                      <div className="bg-[#fcd500]/20 p-6 rounded-full mb-4 group-hover:bg-[#fcd500]/30 transition-all cursor-pointer">
                        <Play className="w-16 h-16 text-[#fcd500] fill-current" />
                      </div>
                      <p className="text-white/70 text-lg font-medium">{language === 'th' ? 'หน้าจอเล่นวิดีโอ' : 'Video Player Screen'}</p>
                      <p className="text-white/50 text-sm mt-2">{video.duration}</p>
                    </div>
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center gap-4 text-white">
                        <button className="hover:text-[#fcd500] transition-colors cursor-pointer">
                          <Play className="w-5 h-5 fill-current" />
                        </button>
                        <div className="flex-1 bg-white/20 rounded-full h-1">
                          <div className="bg-[#fcd500] h-1 rounded-full w-1/3"></div>
                        </div>
                        <span className="text-sm">{video.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnails / Timeline */}
                <div>
                  <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'th' ? 'ไทม์ไลน์วิดีโอ' : 'Video Timeline'}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { time: '00:00', label: language === 'th' ? 'เริ่มต้น' : 'Start' },
                      { time: '00:30', label: language === 'th' ? 'กลางวิดีโอ' : 'Middle' },
                      { time: video.duration, label: language === 'th' ? 'สิ้นสุด' : 'End' }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 ${
                          darkMode ? 'border-gray-700 hover:border-[#fcd500]' : 'border-gray-300 hover:border-[#fcd500]'
                        }`}
                      >
                        <div className={`aspect-video flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <Video className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                        <div className={`px-2 py-1.5 text-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                          <p className={`text-xs font-bold ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`}>
                            {item.time}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Information Card */}
                <div className={`rounded-xl shadow-lg p-5 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
                    <Clock className="w-5 h-5 text-[#fcd500]" />
                    {language === 'th' ? 'ข้อมูลการบันทึก' : 'Recording Information'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'th' ? 'วันที่บันทึก' : 'Recording Date'}
                      </p>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(video.date).toLocaleDateString('th-TH', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'th' ? 'เวลาเริ่มต้น' : 'Start Time'}
                      </p>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {video.time} {language === 'th' ? 'น.' : ''}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'th' ? 'ระยะเวลาทั้งหมด' : 'Total Duration'}
                      </p>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {video.duration}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'th' ? 'ขนาดไฟล์' : 'File Size'}
                      </p>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'th' ? '245 MB' : '245 MB'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Info (1/3 width) */}
              <div className="space-y-4">
                {/* Send Case Button */}
                <button className="w-full px-6 py-3 bg-linear-to-r from-[#0c274b] to-[#0c274b]/80 hover:from-[#0c274b]/90 hover:to-[#0c274b]/70 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
                  <FileText className="w-5 h-5" />
                  <span>{translations.sendCase}</span>
                </button>

                {/* Additional Info Card */}
                <div className={`rounded-xl shadow-lg p-5 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
                    <AlertTriangle className="w-5 h-5 text-[#fcd500]" />
                    {translations.additionalInfo}
                  </h3>

                  {/* Info Items */}
                  <div className="space-y-4">
                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <User className={`w-4 h-4 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                        <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translations.tableOfficer}
                        </p>
                      </div>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>
                        {video.officer} {video.officerName}
                      </p>
                    </div>

                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className={`w-4 h-4 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                        <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translations.mission}
                        </p>
                      </div>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium text-sm`}>
                        {video.title}
                      </p>
                    </div>

                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className={`w-4 h-4 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                        <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translations.location}
                        </p>
                      </div>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium text-sm`}>
                        {video.location}
                      </p>
                    </div>

                    <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className={`w-4 h-4 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                        <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translations.usageLog}
                        </p>
                      </div>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium text-sm mb-1`}>
                        {translations.viewedBy}: <span className="text-[#fcd500]">Admin</span>
                      </p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                        {new Date().toLocaleDateString('th-TH')} {translations.time} 12:10
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => onArchive(video.id)}
                    className={`w-full px-6 py-3 rounded-xl transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer ${
                      video.isArchived
                        ? 'bg-linear-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                        : 'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    <Archive className="w-5 h-5" />
                    <span>{video.isArchived ? translations.archived : translations.archive}</span>
                  </button>

                  <button className="w-full px-6 py-3 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
                    <Download className="w-5 h-5" />
                    <span>{translations.download}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                    <span>{translations.backToMain}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}