import { Home, Eye, X, Calendar, Clock, MapPin, User, Video, Edit, AlertTriangle, Trash2, CheckCircle, PlayCircle, StopCircle, XCircle, Check, Copy, Plus, Save } from 'lucide-react';
import type { SpotCheckItem } from '../../data/spotCheckMockData';

// --- Type Definitions ---
export interface SpotCheckFormData {
  code: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  coordinates: string;
  officer: string;
  cameraId: string;
  priority: 'low' | 'medium' | 'high';
  duration: string;
  description: string;
}

interface CommonModalProps {
  show: boolean;
  onClose: () => void;
  translations: Record<string, string>;
  language: 'th' | 'en';
  darkMode: boolean;
}

interface FormModalProps extends CommonModalProps {
  isEdit: boolean;
  formData: SpotCheckFormData;
  setFormData: (data: SpotCheckFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface ViewModalProps extends CommonModalProps {
  item: SpotCheckItem | null;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  copySuccess: boolean;
  copyToClipboard: (text: string) => void;
  handleAction: (type: 'accept' | 'start' | 'complete' | 'reject') => void;
}

interface DeleteModalProps extends CommonModalProps {
  item: SpotCheckItem | null;
  onConfirm: () => void;
}

interface ActionModalProps extends CommonModalProps {
  item: SpotCheckItem | null;
  actionType: 'accept' | 'start' | 'complete' | 'reject' | null;
  onConfirm: () => void;
}

// Form Modal (ใช้ร่วมกันได้ทั้ง Add และ Edit)
export function SpotCheckFormModal({ show, isEdit, onClose, translations, language, darkMode, formData, setFormData, onSubmit }: FormModalProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`${isEdit ? 'bg-linear-to-r from-yellow-500 to-yellow-600' : 'bg-linear-to-r from-[#0c274b] to-[#0c274b]/90'} px-6 py-4 flex items-center justify-between shrink-0`}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isEdit ? <Edit className="w-6 h-6" /> : null}
            {isEdit ? translations.editRecord : (language === 'th' ? 'เพิ่มรายการออกปฏิบัติงานใหม่' : 'Add New Spot Check')}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className={`rounded-lg p-4 border-l-4 ${isEdit ? (darkMode ? 'bg-yellow-500/10 border-yellow-500' : 'bg-yellow-50 border-yellow-500') : (darkMode ? 'bg-blue-500/10 border-blue-500' : 'bg-blue-50 border-blue-500')}`}>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#0c274b]'}`}>
                  {isEdit ? `${language === 'th' ? 'แก้ไขรายการ:' : 'Edit Record:'} ${formData.code}` : (language === 'th' ? 'เพิ่มรายการออกปฏิบัติงานใหม่' : 'Add New Spot Check')}
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'th' ? (isEdit ? 'กรุณาแก้ไขข้อมูลที่ต้องการ' : 'กรุณากรอกข้อมูลให้ครบถ้วน') : (isEdit ? 'Please edit the information as needed' : 'Please fill in all required information')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'th' ? 'รหัสงาน' : 'Code'} <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="SC-XXX" className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'th' ? 'ลำดับความสำคัญ' : 'Priority'} <span className="text-red-500">*</span></label>
                  <select required value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}>
                    <option value="low">{language === 'th' ? 'ปกติ' : 'Low'}</option>
                    <option value="medium">{language === 'th' ? 'ปานกลาง' : 'Medium'}</option>
                    <option value="high">{language === 'th' ? 'สำคัญมาก' : 'High'}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'th' ? 'หัวข้อ/รายละเอียดงาน' : 'Title/Description'} <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder={language === 'th' ? 'ระบุรายละเอียดงาน...' : 'Enter task description...'} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><Calendar className="w-4 h-4 inline mr-1" />{language === 'th' ? 'วันที่' : 'Date'} <span className="text-red-500">*</span></label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><Clock className="w-4 h-4 inline mr-1" />{language === 'th' ? 'เวลา' : 'Time'} <span className="text-red-500">*</span></label>
                  <input type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><MapPin className="w-4 h-4 inline mr-1" />{language === 'th' ? 'สถานที่' : 'Location'} <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder={language === 'th' ? 'ชื่อสถานที่...' : 'Location name...'} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'th' ? 'ที่อยู่' : 'Address'} <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder={language === 'th' ? 'ที่อยู่เต็ม...' : 'Full address...'} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'th' ? 'พิกัด GPS (Latitude, Longitude)' : 'GPS Coordinates'}</label>
                  <input type="text" value={formData.coordinates} onChange={(e) => setFormData({...formData, coordinates: e.target.value})} placeholder="13.0297° N, 100.9925° E" className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><User className="w-4 h-4 inline mr-1" />{language === 'th' ? 'เจ้าหน้าที่' : 'Officer'} <span className="text-red-500">*</span></label>
                  <select required value={formData.officer} onChange={(e) => setFormData({...formData, officer: e.target.value})} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all cursor-pointer`}>
                    <option value="">{language === 'th' ? 'เลือกเจ้าหน้าที่' : 'Select officer'}</option>
                    <option value="A">ส.ต.ท. สมชาย ใจดี (A)</option>
                    <option value="B">ส.ต.อ. ประยุทธ์ วีรกุล (B)</option>
                    <option value="C">ส.ต.ต. วิชัย สมบูรณ์ (C)</option>
                    <option value="D">ส.ต. นพดล ศรีสุข (D)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><Video className="w-4 h-4 inline mr-1" />{language === 'th' ? 'รหัสกล้อง' : 'Camera ID'} <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.cameraId} onChange={(e) => setFormData({...formData, cameraId: e.target.value})} placeholder="0001" className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'th' ? 'ระยะเวลา (ชั่วโมง)' : 'Duration (hours)'}</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder={language === 'th' ? '2 ชม.' : '2 hrs'} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all`} />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{language === 'th' ? 'หมายเหตุเพิ่มเติม' : 'Additional Notes'}</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder={language === 'th' ? 'ระบุรายละเอียดเพิ่มเติม (ถ้ามี)' : 'Enter additional details (optional)'} rows={3} className={`w-full px-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#fcd500]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0c274b]'} focus:outline-none focus:ring-2 focus:ring-[#fcd500]/50 transition-all resize-none`} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-gray-300 dark:border-gray-600">
                <button type="button" onClick={onClose} className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2">
                  <X className="w-5 h-5" /> <span>{translations.cancel}</span>
                </button>
                <button type="submit" className={`px-8 py-3 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 ${isEdit ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-[oklch(65%_0.24_149.579)]'}`}>
                  {isEdit ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                  <span>{translations.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// View Modal
export function ViewModal({ show, item, onClose, translations, language, darkMode, getStatusColor, getPriorityColor, copyToClipboard, copySuccess, handleAction }: ViewModalProps) {
  if (!show || !item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-3xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Eye className="w-6 h-6" /> {translations.viewDetails}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="space-y-6">
              <div className={`rounded-lg p-4 border-l-4 ${darkMode ? 'bg-blue-500/10 border-blue-500' : 'bg-blue-50 border-blue-500'}`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-[#fcd500]' : 'text-[#0c274b]'}`}>{item.code}</h3>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusColor(item.status)}`}>{item.statusText}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'หัวข้อ' : 'Title'}</label>
                  <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'ลำดับความสำคัญ' : 'Priority'}</label>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getPriorityColor(item.priority)}`}>{item.priority === 'high' ? 'สำคัญมาก' : item.priority === 'medium' ? 'ปานกลาง' : 'ปกติ'}</span>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><Calendar className="w-4 h-4 inline mr-1" />{language === 'th' ? 'วันที่' : 'Date'}</label>
                  <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.date}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><Clock className="w-4 h-4 inline mr-1" />{language === 'th' ? 'เวลา' : 'Time'}</label>
                  <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.time}</p>
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><MapPin className="w-4 h-4 inline mr-1" />{language === 'th' ? 'สถานที่' : 'Location'}</label>
                  <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.location}</p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.address}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'พิกัด GPS' : 'GPS Coordinates'}</label>
                  <div className="flex items-center gap-2">
                    <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.coordinates}</p>
                    <div className="relative">
                      <button onClick={() => copyToClipboard(item.coordinates)} className={`p-2 rounded-lg transition-all hover:scale-110 ${copySuccess ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`} title={language === 'th' ? 'คัดลอกพิกัด' : 'Copy coordinates'}>
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {copySuccess && <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded-lg text-xs whitespace-nowrap ${darkMode ? 'bg-[oklch(65%_0.24_149.579)] text-white' : 'bg-green-500 text-white'} shadow-lg z-50`}>{language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}</div>}
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><User className="w-4 h-4 inline mr-1" />{language === 'th' ? 'เจ้าหน้าที่' : 'Officer'}</label>
                  <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.officerName}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><Video className="w-4 h-4 inline mr-1" />{language === 'th' ? 'รหัสกล้อง' : 'Camera ID'}</label>
                  <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.cameraId}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'ระยะเวลา' : 'Duration'}</label>
                  <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.duration}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-gray-300 dark:border-gray-600">
                {item.status === 'waiting' && (
                  <>
                    <button onClick={() => handleAction('accept')} className="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span>{translations.acceptJob}</span></button>
                    <button onClick={() => handleAction('reject')} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"><XCircle className="w-5 h-5" /><span>{translations.rejectJob}</span></button>
                  </>
                )}
                {item.status === 'accepted' && (
                  <>
                    <button onClick={() => handleAction('start')} className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"><PlayCircle className="w-5 h-5" /><span>{translations.startJob}</span></button>
                    <button onClick={() => handleAction('reject')} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"><XCircle className="w-5 h-5" /><span>{translations.rejectJob}</span></button>
                  </>
                )}
                {item.status === 'in-progress' && (
                  <button onClick={() => handleAction('complete')} className="px-6 py-3 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"><StopCircle className="w-5 h-5" /><span>{translations.completeJob}</span></button>
                )}
                {(item.status === 'completed' || item.status === 'cancelled') && (
                  <button onClick={onClose} className="px-8 py-3 bg-linear-to-r from-[#0c274b] to-[#0c274b]/90 hover:from-[#0c274b]/90 hover:to-[#0c274b] text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"><Home className="w-5 h-5" /><span>{translations.backToMain}</span></button>
                )}
                <button onClick={onClose} className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"><X className="w-5 h-5" /><span>{translations.close}</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Delete Modal
export function DeleteModal({ show, item, onClose, onConfirm, translations, language, darkMode }: DeleteModalProps) {
  if (!show || !item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-4 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><AlertTriangle className="w-6 h-6" />{translations.deleteConfirm}</h2>
        </div>
        <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-4">
            <div className={`rounded-lg p-4 border-l-4 ${darkMode ? 'bg-red-500/10 border-red-500' : 'bg-red-50 border-red-500'}`}>
              <p className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{translations.deleteMessage}</p>
              <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'รายการ:' : 'Record:'} <span className="font-bold text-gray-900 dark:text-white">{item.code}</span></p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'ตรวจสอบ:' : 'Inspection:'} <span className="font-normal">{item.title}</span></p>
            </div>
            <div className="flex gap-3 justify-center pt-4">
              <button onClick={onClose} className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"><X className="w-5 h-5" /><span>{translations.cancel}</span></button>
              <button onClick={onConfirm} className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"><Trash2 className="w-5 h-5" /><span>{translations.confirm}</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Action Modal
export function ActionModal({ show, item, actionType, onClose, onConfirm, translations, language, darkMode }: ActionModalProps) {
  if (!show || !item || !actionType) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`px-6 py-4 shrink-0 ${actionType === 'accept' ? 'bg-linear-to-r from-green-500 to-green-600' : actionType === 'start' ? 'bg-linear-to-r from-blue-500 to-blue-600' : actionType === 'complete' ? 'bg-linear-to-r from-purple-500 to-purple-600' : 'bg-linear-to-r from-red-500 to-red-600'}`}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {actionType === 'accept' && <><CheckCircle className="w-6 h-6" />{translations.acceptJobConfirm}</>}
            {actionType === 'start' && <><PlayCircle className="w-6 h-6" />{translations.startJobConfirm}</>}
            {actionType === 'complete' && <><StopCircle className="w-6 h-6" />{translations.completeJobConfirm}</>}
            {actionType === 'reject' && <><XCircle className="w-6 h-6" />{translations.rejectJobConfirm}</>}
          </h2>
        </div>
        <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-4">
            <div className={`rounded-lg p-4 border-l-4 ${actionType === 'accept' ? darkMode ? 'bg-green-500/10 border-green-500' : 'bg-green-50 border-green-500' : actionType === 'start' ? darkMode ? 'bg-blue-500/10 border-blue-500' : 'bg-blue-50 border-blue-500' : actionType === 'complete' ? darkMode ? 'bg-purple-500/10 border-purple-500' : 'bg-purple-50 border-purple-500' : darkMode ? 'bg-red-500/10 border-red-500' : 'bg-red-50 border-red-500'}`}>
              <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {actionType === 'accept' && translations.acceptJobMessage}
                {actionType === 'start' && translations.startJobMessage}
                {actionType === 'complete' && translations.completeJobMessage}
                {actionType === 'reject' && translations.rejectJobMessage}
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'th' ? 'รายการ:' : 'Record:'} <span className="font-bold">{item.code}</span></p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.title}</p>
            </div>
            <div className="flex gap-3 justify-center pt-4">
              <button onClick={onClose} className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"><X className="w-5 h-5" /><span>{translations.cancel}</span></button>
              <button onClick={onConfirm} className={`px-8 py-3 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 ${actionType === 'accept' ? 'bg-green-500 hover:bg-[oklch(65%_0.24_149.579)]' : actionType === 'start' ? 'bg-blue-500 hover:bg-blue-600' : actionType === 'complete' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-red-500 hover:bg-red-600'}`}>
                {actionType === 'accept' && <CheckCircle className="w-5 h-5" />}
                {actionType === 'start' && <PlayCircle className="w-5 h-5" />}
                {actionType === 'complete' && <StopCircle className="w-5 h-5" />}
                {actionType === 'reject' && <XCircle className="w-5 h-5" />}
                <span>{translations.confirm}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}