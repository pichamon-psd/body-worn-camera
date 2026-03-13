export const navItems = [
    { id: 'dashboard', labelKey: 'dashboard', iconName: 'LayoutDashboard' },
    { id: 'activities', labelKey: 'activities', iconName: 'Activity' },
    { id: 'reports', labelKey: 'reports', iconName: 'FileText' },
    { id: 'live', labelKey: 'live', iconName: 'Video' },
    { id: 'videos', labelKey: 'videos', iconName: 'FileVideo' },
    { id: 'users', labelKey: 'users', iconName: 'Users' },
];

export const cameras = [
  { id: 1, name: 'ว.ต.อ.สมชาย', status: 'online' },
  { id: 2, name: 'ส.ต.ท.วิชัย', status: 'online' },
  { id: 3, name: 'จ.ส.ต.สมศรี', status: 'offline' },
];

export const gpsDevices = [
  { id: 1, name: 'ว.ต.อ.สมชาย (กำลังบันทึก)' },
  { id: 2, name: 'ส.ต.ท.วิชัย' },
];

export const allAlerts = [
  { id: 1, typeKey: 'suspiciousPerson', officer: 'ว.ต.อ.สมชาย', time: '10:32', severity: 'high' as const, category: 'event' as const, date: '2026-03-05', datetime: '2026-03-05T10:32:00' },
  { id: 2, typeKey: 'outOfArea', officer: 'ส.ต.ท.วิชัย', time: '11:05', severity: 'medium' as const, category: 'event' as const, date: '2026-03-05', datetime: '2026-03-05T11:05:00' },
  { id: 3, typeKey: 'cameraOffline', officer: 'จ.ส.ต.สมศรี', time: '11:10', severity: 'medium' as const, category: 'report' as const, date: '2026-03-04', datetime: '2026-03-04T11:10:00' },
  { id: 4, typeKey: 'suspiciousPerson', officer: 'ว.ต.อ.สมชาย', time: '09:15', severity: 'high' as const, category: 'event' as const, date: '2026-03-04', datetime: '2026-03-04T09:15:00' },
  { id: 5, typeKey: 'outOfArea', officer: 'ส.ต.ท.วิชัย', time: '14:20', severity: 'medium' as const, category: 'event' as const, date: '2026-03-03', datetime: '2026-03-03T14:20:00' },
  { id: 6, typeKey: 'cameraOffline', officer: 'จ.ส.ต.สมศรี', time: '08:45', severity: 'medium' as const, category: 'report' as const, date: '2026-03-03', datetime: '2026-03-03T08:45:00' },
];