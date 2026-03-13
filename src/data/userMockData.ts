export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  roleLevel: 'high' | 'medium' | 'low';
  status: 'active' | 'inactive';
  department?: string;
}

// ข้อมูลจำลอง
export const initialUsersData: User[] = [
  {
    id: '1',
    username: 'admin01',
    fullName: 'ผู้ดูแล',
    role: '', 
    roleLevel: 'high',
    status: 'active',
    department: 'IT',
  },
  {
    id: '2',
    username: 'sup01',
    fullName: 'หัวหน้า',
    role: '', 
    roleLevel: 'medium',
    status: 'active',
    department: 'Operations',
  },
  {
    id: '3',
    username: 'off02',
    fullName: 'เจ้าหน้าที่',
    role: '', 
    roleLevel: 'low',
    status: 'inactive',
    department: 'Patrol',
  },
  {
    id: '4',
    username: 'off03',
    fullName: 'จ.ส.ต.มนตรี',
    role: '', 
    roleLevel: 'low',
    status: 'active',
    department: 'Patrol',
  },
  {
    id: '5',
    username: 'sup02',
    fullName: 'ส.ต.ท.วิจิตร',
    role: '', 
    roleLevel: 'medium',
    status: 'active',
    department: 'Security',
  },
  {
    id: '6',
    username: 'off04',
    fullName: 'ร.ต.อ.สมชาย',
    role: '', 
    roleLevel: 'low',
    status: 'active',
    department: 'Patrol',
  },
];