export interface VideoItem {
  id: string;
  code: string;
  title: string;
  officer: string;
  officerName: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: 'ai-alert' | 'normal';
  statusText: string;
  thumbnail: string;
  videoUrl: string;
  isArchived: boolean;
}

export const initialVideoData: VideoItem[] = [
  {
    id: '1',
    code: 'SC-001',
    title: 'ออกตรวจพื้นที่ สวนลุมพินี',
    officer: 'ร.อ.อ.',
    officerName: 'สมชาย',
    date: '2026-02-26',
    time: '08:30',
    duration: '01:25:30',
    location: 'สวนลุมพินี กรุงเทพมหานคร',
    status: 'ai-alert',
    statusText: '', // จะถูกแทนที่ด้วยภาษาที่เลือกในหน้าหลัก
    thumbnail: '',
    videoUrl: '',
    isArchived: false,
  },
  {
    id: '2',
    code: 'SC-002',
    title: 'ออกตรวจพื้นที่ ถนนสุขุมวิท',
    officer: 'พ.ต.ท.',
    officerName: 'วิจิตร',
    date: '2026-02-26',
    time: '10:15',
    duration: '00:45:20',
    location: 'ถนนสุขุมวิท แขวงคลองเตย กรุงเทพมหานคร',
    status: 'normal',
    statusText: '',
    thumbnail: '',
    videoUrl: '',
    isArchived: false,
  },
  {
    id: '3',
    code: 'SC-003',
    title: 'ออกตรวจพื้นที่ ตลาดนัดจตุจักร',
    officer: 'จ.ส.ท.',
    officerName: 'มนตรี',
    date: '2026-02-25',
    time: '14:20',
    duration: '02:10:15',
    location: 'ตลาดนัดจตุจักร เขตจตุจักร กรุงเทพมหานคร',
    status: 'normal',
    statusText: '',
    thumbnail: '',
    videoUrl: '',
    isArchived: false,
  },
  {
    id: '4',
    code: 'SC-004',
    title: 'ออกตรวจพื้นที่ ท่าเรือ สาทร',
    officer: 'ร.อ.อ.',
    officerName: 'สมชาย',
    date: '2026-02-25',
    time: '16:45',
    duration: '01:15:40',
    location: 'ท่าเรือสาทร แขวงสาทร กรุงเทพมหานคร',
    status: 'ai-alert',
    statusText: '',
    thumbnail: '',
    videoUrl: '',
    isArchived: false,
  },
  {
    id: '5',
    code: 'SC-005',
    title: 'ออกตรวจพื้นที่ ถนนข้าวสาร',
    officer: 'พ.ต.ท.',
    officerName: 'วิจิตร',
    date: '2026-02-24',
    time: '09:00',
    duration: '00:55:30',
    location: 'ถนนข้าวสาร เขตดุสิต กรุงเทพมหานคร',
    status: 'normal',
    statusText: '',
    thumbnail: '',
    videoUrl: '',
    isArchived: false,
  },
];