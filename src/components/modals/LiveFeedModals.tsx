import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Circle, Clock, Video, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import type { LiveFeedItem } from '../../data/liveFeedMockData';
import Hls from 'hls.js';

// ==========================================
// Types & Interfaces
// ==========================================
export type TranslationsType = Record<string, string>;

export interface VideoModalProps {
  show: boolean;
  feed: LiveFeedItem | null;
  onClose: () => void;
  translations: TranslationsType;
  language: 'th' | 'en';
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
}

export interface DetailsModalProps {
  show: boolean;
  feed: LiveFeedItem | null;
  onClose: () => void;
  onOpenVideo: () => void;
  getStatusColor: (status: string) => string;
  translations: TranslationsType;
  language: 'th' | 'en';
  darkMode: boolean;
}

// ==========================================
// Video Player Modal (ระบบยิง API สตรีม)
// ==========================================
export function LiveFeedVideoModal({ show, feed, onClose, translations, language, isPlaying, isMuted, togglePlay, toggleMute }: VideoModalProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // ดึง URL จาก API
  useEffect(() => {
    if (show && feed) {
      setIsConnecting(true);
      setApiError(null);
      setStreamUrl(null);

      let isCancelled = false;

      const connectStream = async (retryCount = 0) => {
        if (isCancelled) return;

        try {
          const response = await fetch('/api/v1/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({
              User: "true",
              deviceCode: "1000093", 
              channelId: "1000093$1$0$0"
            })
          });

          if (!response.ok) throw new Error('Network response was not ok');
          
          const jsonResponse = await response.json();
          
          if (jsonResponse.code === 1000 && jsonResponse.data?.status === 1) {
            const rawUrl = jsonResponse.data.video_url;
            // ลบโดเมนทิ้งเพื่อให้วิ่งผ่าน Proxy ไม่ติด CORS
            const safeUrl = rawUrl.replace('http://www.centrecities.com:3007', '');
            
            setStreamUrl(safeUrl);
            setIsConnecting(false);
          } else if (jsonResponse.data?.status === 0 && retryCount < 20) {
            console.log(`รอภาพจากกล้อง... (รอบที่ ${retryCount + 1})`);
            setTimeout(() => connectStream(retryCount + 1), 3000);
          } else {
            const errorStatus = jsonResponse.data?.status ?? jsonResponse.code ?? 'Unknown';
            setApiError(language === 'th' ? `หมดเวลาเชื่อมต่อ (สถานะ: ${errorStatus})` : `Connection timeout (Status: ${errorStatus})`);
            setIsConnecting(false);
          }
        } catch {
          setApiError(language === 'th' ? 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' : 'Connection error occurred.');
          setIsConnecting(false);
        }
      };

      connectStream();

      return () => { isCancelled = true; };
    }
  }, [show, feed, language]);


  useEffect(() => {
    let hls: Hls;

    if (streamUrl && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls({ autoStartLoad: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // เบราว์เซอร์ส่วนใหญ่บังคับให้วิดีโอต้อง Mute ถึงจะเล่น Auto ได้
          video.muted = true; 
          video.play().catch(e => console.log("Auto-play error:", e));
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.muted = true;
          video.play().catch(e => console.log("Auto-play error:", e));
        });
      }
    }

    return () => { if (hls) hls.destroy(); };
  }, [streamUrl]);

  // ผูกปุ่มคุม Play/Pause ของหน้าต่าง UI
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isPlaying]);

  // ผูกปุ่มคุมเสียง
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!show || !feed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-black">
        {/* Header */}
        <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg animate-pulse">
              <Circle className="w-3 h-3 fill-white" />
              <span className="text-white font-bold">{translations.live}</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {language === 'th' ? 'ภาพสดจากกล้อง' : 'Live Camera'} - 001
            </h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg shrink-0 cursor-pointer z-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="relative bg-black aspect-video w-full h-full flex items-center justify-center">
            
            {/* Loading / Error Overlay */}
            {(isConnecting || apiError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 z-10">
                <div className="text-center space-y-4">
                  {apiError ? (
                    <>
                      <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
                      <p className="text-white text-xl font-bold">{apiError}</p>
                      <button onClick={onClose} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer">
                        {language === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Video className="w-24 h-24 text-gray-600 mx-auto animate-pulse" />
                      <div className="space-y-2">
                        <p className="text-white text-xl font-bold">
                          {language === 'th' ? 'กำลังดึงภาพสด...' : 'Connecting to live feed...'}
                        </p>
                        <p className="text-yellow-400 text-sm font-medium animate-pulse mt-2">
                          (โปรดรอสักครู่ กล้องกำลังเตรียมการส่งสัญญาณ)
                        </p>
                      </div>
                      <div className="flex justify-center gap-2 mt-6">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ตัวเล่นวิดีโอ */}
            {!isConnecting && !apiError && streamUrl && (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-contain bg-black z-0"
                autoPlay
                muted={true} 
                playsInline
              />
            )}

            {/* Overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg z-20 pointer-events-none">
              <Circle className="w-3 h-3 fill-white animate-pulse" />
              <span className="font-bold text-sm">{translations.live}</span>
            </div>

            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 text-white rounded-lg backdrop-blur-sm z-20 pointer-events-none">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{feed.time}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 z-20 transition-opacity hover:opacity-100 opacity-0 lg:opacity-100">
              <div className="flex items-center justify-between gap-4">
                <button onClick={togglePlay} className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full cursor-pointer">
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className={`h-full bg-red-500 ${isPlaying ? 'w-full transition-all duration-[60s] ease-linear' : 'w-0'}`}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full cursor-pointer">
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <button 
                    onClick={() => {
                      if (videoRef.current && videoRef.current.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                      }
                    }} 
                    className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full cursor-pointer"
                  >
                    <Maximize className="w-6 h-6" />
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

// ==========================================
// Pre-Connect Details Modal
// ==========================================
export function LiveFeedDetailsModal({ show, feed, onClose, onOpenVideo, getStatusColor, translations, language, darkMode }: DetailsModalProps) {
  if (!show || !feed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className={`w-full max-w-6xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`px-6 py-4 border-b shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {translations.detailsTitle}
              </h2>
              <div className={`px-3 py-1 rounded-lg font-bold ${darkMode ? 'bg-[#0c274b] text-[#fcd500]' : 'bg-[#0c274b] text-[#fcd500]'}`}>
                {feed.code}
              </div>
              {feed.isLive && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg animate-pulse">
                  <Circle className="w-2 h-2 fill-white" />
                  {translations.live}
                </div>
              )}
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors shrink-0 cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
            <div className="lg:col-span-3 space-y-4">
              <div className={`rounded-lg overflow-hidden aspect-video ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-700 via-gray-600 to-gray-700 relative">
                  <div className="text-center space-y-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video w-16 h-16 text-gray-400 mx-auto" aria-hidden="true">
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                      <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                    </svg>
                    <p className="text-lg font-medium text-gray-300">{translations.cameraFeed}</p>
                    <p className="text-sm text-gray-400">{language === 'th' ? 'กล้อง' : 'Camera'} {feed.cameraId}</p>
                  </div>
                  
                  {feed.isLive && (
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle w-3 h-3 fill-white animate-pulse" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      <span className="font-bold text-sm">{translations.live}</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 text-white rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video w-4 h-4 text-white" aria-hidden="true">
                        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                        <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                      </svg>
                      <span className="font-mono">{feed.cameraId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'th' ? 'รายละเอียดภารกิจ' : 'Mission Details'}
                </p>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feed.title}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className={`w-4 h-4 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feed.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className={`w-4 h-4 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feed.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className={`w-4 h-4 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feed.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{translations.detailsOfficer}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-[#fcd500] to-[#fed300] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#0c274b] font-bold text-lg">{feed.officer}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feed.officerName}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'รหัส' : 'Code'} {feed.officer}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{translations.detailsTask}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-lg font-bold ${darkMode ? 'bg-[#0c274b] text-[#fcd500]' : 'bg-[#0c274b] text-[#fcd500]'}`}>{feed.code}</div>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusColor(feed.status)}`}>{feed.statusText}</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{translations.camera}</p>
                <div className="flex items-center gap-2">
                  <Video className={`w-5 h-5 ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`} />
                  <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'th' ? 'กล้อง' : 'Camera'} #{feed.cameraId}</p>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{translations.detailsRecordStatus}</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{translations.detailsRecording}</p>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{translations.detailsUsageLog}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translations.detailsOpenedBy} <span className="font-bold">Admin</span></p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feed.date} {translations.detailsTime} {feed.time}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button onClick={onOpenVideo} className="w-full px-6 py-3 bg-linear-to-r from-[#fcd500] to-[#fed300] hover:from-[#fed300] hover:to-[#fcd500] text-[#0c274b] font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                  <Video className="w-5 h-5" />
                  <span>{language === 'th' ? 'เปิดดูภาพสด' : 'View Live Feed'}</span>
                </button>
                <button onClick={onClose} className="w-full px-6 py-3 bg-black text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg hover:bg-gray-900 cursor-pointer">
                  {translations.backToMain}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}