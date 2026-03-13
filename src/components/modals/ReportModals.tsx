import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteReportModalProps {
  show: boolean;
  reportId: string | null;
  onClose: () => void;
  onConfirm: () => void;
  language: 'th' | 'en';
  darkMode: boolean;
}

export function DeleteReportModal({ show, reportId, onClose, onConfirm, language, darkMode }: DeleteReportModalProps) {
  if (!show || !reportId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            {language === 'th' ? 'ยืนยันการลบ' : 'Confirm Delete'}
          </h2>
        </div>

        <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-4">
            <div className={`rounded-lg p-4 border-l-4 ${darkMode ? 'bg-red-500/10 border-red-500' : 'bg-red-50 border-red-500'}`}>
              <p className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'th' ? 'คุณแน่ใจหรือไม่ที่จะลบรายงานนี้?' : 'Are you sure you want to delete this report?'}
              </p>
              <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'th' ? 'รายการ:' : 'Record:'} <span className="font-bold text-gray-900 dark:text-white">{reportId}</span>
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                <span>{language === 'th' ? 'ยกเลิก' : 'Cancel'}</span>
              </button>
              <button
                onClick={onConfirm}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>{language === 'th' ? 'ยืนยัน' : 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}