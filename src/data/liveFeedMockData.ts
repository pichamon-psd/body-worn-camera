export interface LiveFeedItem {
  id: string;
  code: string;
  title: string;
  status: 'active' | 'waiting' | 'offline';
  statusText: string;
  officer: string;
  officerName: string;
  cameraId: string;
  location: string;
  date: string;
  time: string;
  isLive: boolean;
  reportType: 'daily' | 'incident' | 'inspection' | 'training';
}

export const allLiveFeedData: LiveFeedItem[] = [
  {
    id: '1',
    code: 'SC-001',
    title: 'ตรวจตราพื้นที่เสี่ยงภัย บริเวณตลาดสด',
    status: 'active',
    statusText: '', // จะถูก override จาก translations
    officer: 'A',
    officerName: 'ส.ต.ท. สมชาย ใจดี',
    cameraId: '0001',
    location: 'ตลาดสดเทศบาล',
    date: '15/01/2025',
    time: '08:30',
    isLive: true,
    reportType: 'daily',
  },
];