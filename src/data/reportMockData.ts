export interface ReportItem {
  id: string;
  code: string;
  date: string;
  fullDate: string;
  officer: string;
  officerName: string;
  mission: string;
  usageTime: string;
  startTime: string;
  endTime: string;
  recordedDuration: string;
  actualDuration: string;
  status: 'passed' | 'failed';
  statusText: string;
  failReason?: string;
  location: string;
  videoUrl: string;
}

// ==========================================
// Mock Data ข้อมูลจำลองเริ่มต้น
// ==========================================
export const initialReportData: ReportItem[] = [
  {
    id: '1',
    code: 'SC-001',
    date: '10/01',
    fullDate: '10/01/2569',
    officer: 'ร.ต.อ.',
    officerName: 'สมชาย',
    mission: 'ออกตรวจพื้นที่...',
    usageTime: '14:05-15:20',
    startTime: '14:05',
    endTime: '15:20',
    recordedDuration: '2',
    actualDuration: '1:15',
    status: 'failed',
    statusText: 'ไม่ผ่าน',
    failReason: 'ปิดก่อนสามสิ้นสุดเวลาจริง',
    location: 'พื้นที่ตรวจการณ์',
    videoUrl: 'https://example.com/video1.mp4',
  },
  {
    id: '2',
    code: 'SC-002',
    date: '10/01',
    fullDate: '10/01/2569',
    officer: 'ส.ต.',
    officerName: 'ท.วิจิตร',
    mission: 'ออกตรวจพื้นที่...',
    usageTime: '08:00-10:30',
    startTime: '08:00',
    endTime: '10:30',
    recordedDuration: '2.5',
    actualDuration: '2.5',
    status: 'passed',
    statusText: 'ผ่าน',
    location: 'ตลาดสด',
    videoUrl: 'https://example.com/video2.mp4',
  },
  {
    id: '3',
    code: 'SC-003',
    date: '10/01',
    fullDate: '10/01/2569',
    officer: 'จ.ส.ต.',
    officerName: 'มนตรี',
    mission: 'ออกตรวจพื้นที่...',
    usageTime: '20:00-22:00',
    startTime: '20:00',
    endTime: '22:00',
    recordedDuration: '2',
    actualDuration: '2',
    status: 'passed',
    statusText: 'ผ่าน',
    location: 'ชุมชน',
    videoUrl: 'https://example.com/video3.mp4',
  },
  {
    id: '4',
    code: 'SC-004',
    date: '11/01',
    fullDate: '11/01/2569',
    officer: 'ร.ต.อ.',
    officerName: 'สมชาย',
    mission: 'ตรวจตลาดนัด...',
    usageTime: '06:00-08:30',
    startTime: '06:00',
    endTime: '08:30',
    recordedDuration: '2.5',
    actualDuration: '2.5',
    status: 'passed',
    statusText: 'ผ่าน',
    location: 'ตลาดนัด',
    videoUrl: 'https://example.com/video4.mp4',
  },
  {
    id: '5',
    code: 'SC-005',
    date: '11/01',
    fullDate: '11/01/2569',
    officer: 'ส.ต.',
    officerName: 'ท.วิจิตร',
    mission: 'ตรวจสอบพื้นที่...',
    usageTime: '10:00-11:30',
    startTime: '10:00',
    endTime: '11:30',
    recordedDuration: '1.5',
    actualDuration: '1',
    status: 'failed',
    statusText: 'ไม่ผ่าน',
    failReason: 'ปิดก่อนสามสิ้นสุดเวลาจริง',
    location: 'สวนสาธารณะ',
    videoUrl: 'https://example.com/video5.mp4',
  },
  {
    id: '6',
    code: 'SC-006',
    date: '12/01',
    fullDate: '12/01/2569',
    officer: 'จ.ส.ต.',
    officerName: 'มนตรี',
    mission: 'ตรวจท่าเรือ...',
    usageTime: '15:00-18:00',
    startTime: '15:00',
    endTime: '18:00',
    recordedDuration: '3',
    actualDuration: '3',
    status: 'passed',
    statusText: 'ผ่าน',
    location: 'ท่าเรือ',
    videoUrl: 'https://example.com/video6.mp4',
  },
];