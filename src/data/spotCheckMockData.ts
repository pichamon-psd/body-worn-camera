export interface SpotCheckItem {
  id: string;
  code: string;
  title: string;
  status: 'waiting' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  statusText: string;
  date: string;
  time: string;
  location: string;
  address: string;
  coordinates: string;
  officer: string;
  officerName: string;
  cameraId: string;
  priority: 'low' | 'medium' | 'high';
  duration?: string;
  reportType: 'daily' | 'incident' | 'inspection' | 'training';
}

export const initialSpotCheckData: SpotCheckItem[] = [
  {
    id: '1',
    code: 'SC-001',
    title: 'ตรวจตราพื้นที่เสี่ยงภัย บริเวณตลาดสด',
    status: 'waiting',
    statusText: 'รอรับงาน',
    date: '15/01/2025',
    time: '08:30',
    location: 'ตลาดสดเทศบาล',
    address: 'ตำบลบางละมุง อำเภอบางละมุง จังหวัดชลบุรี',
    coordinates: '13.0297° N, 100.9925° E',
    officer: 'A',
    officerName: 'ส.ต.ท. สมชาย ใจดี',
    cameraId: '0001',
    priority: 'high',
    duration: '2 ชม.',
    reportType: 'daily',
  },
  {
    id: '2',
    code: 'SC-002',
    title: 'ออกปฏิบัติงานตรวจสอบเหตุร้องเรียน',
    status: 'accepted',
    statusText: 'รับงานแล้ว',
    date: '15/01/2025',
    time: '10:00',
    location: 'หมู่บ้านสุขสันต์',
    address: 'ตำบลมาบตาพุด อำเภอเมือง จังหวัดระยอง',
    coordinates: '12.6431° N, 101.2855° E',
    officer: 'B',
    officerName: 'ส.ต.อ. ประยุทธ์ วีรกุล',
    cameraId: '0002',
    priority: 'medium',
    duration: '1.5 ชม.',
    reportType: 'incident',
  },
  {
    id: '3',
    code: 'SC-003',
    title: 'ตรวจพื้นที่จุดเสี่ยงอาชญากรรม ย่านสถานีรถไฟ',
    status: 'in-progress',
    statusText: 'กำลังปฏิบัติงาน',
    date: '15/01/2025',
    time: '14:00',
    location: 'สถานีรถไฟ',
    address: 'ตำบลนาเกลือ อำเภอบางละมุง จังหวัดชลบุรี',
    coordinates: '13.1234° N, 100.8765° E',
    officer: 'C',
    officerName: 'ส.ต.ต. วิชัย สมบูรณ์',
    cameraId: '0003',
    priority: 'high',
    duration: '3 ชม.',
    reportType: 'inspection',
  },
  {
    id: '4',
    code: 'SC-004',
    title: 'ตรวจตราพื้นที่โรงเรียนและสถานศึกษา',
    status: 'completed',
    statusText: 'เสร็จสิ้น',
    date: '14/01/2025',
    time: '09:00',
    location: 'โรงเรียนเทศบาล',
    address: 'ตำบลหนองปรือ อำเภอบางละมุง จังหวัดชลบุรี',
    coordinates: '13.0567° N, 100.9234° E',
    officer: 'A',
    officerName: 'ส.ต.ท. สมชาย ใจดี',
    cameraId: '0001',
    priority: 'medium',
    duration: '2 ชม.',
    reportType: 'training',
  },
  {
    id: '5',
    code: 'SC-005',
    title: 'ตรวจสอบข้อร้องเรียนเสียงดัง',
    status: 'completed',
    statusText: 'เสร็จสิ้น',
    date: '14/01/2025',
    time: '16:30',
    location: 'ซอยสุขุมวิท 15',
    address: 'ตำบลบางปลาสร้อย อำเภอเมือง จังหวัดชลบุรี',
    coordinates: '13.2345° N, 100.7654° E',
    officer: 'D',
    officerName: 'ส.ต. นพดล ศรีสุข',
    cameraId: '0004',
    priority: 'low',
    duration: '1 ชม.',
    reportType: 'daily',
  },
  {
    id: '6',
    code: 'SC-006',
    title: 'ปฏิบัติงานตรวจตราชายหาด',
    status: 'cancelled',
    statusText: 'ยกเลิก',
    date: '16/01/2025',
    time: '07:00',
    location: 'หาดจอมเทียน',
    address: 'ตำบลหนองปรือ อำเภอบางละมุง จังหวัดชลบุรี',
    coordinates: '12.8765° N, 100.8912° E',
    officer: 'B',
    officerName: 'ส.ต.อ. ประยุทธ์ วีรกุล',
    cameraId: '0002',
    priority: 'medium',
    duration: '4 ชม.',
    reportType: 'inspection',
  },
];