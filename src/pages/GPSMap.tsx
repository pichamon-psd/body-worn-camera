import { useState, useEffect } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { mapTranslations, type SupportedLanguage } from '../locales/mapTranslations';

// สร้าง Interface สำหรับรับค่าจาก API
interface LocationData {
  deviceCategory: string;
  deviceCode: string;
  deviceName: string;
  deviceType: string;
  gpsX: number; // Longitude
  gpsY: number; // Latitude
  orgCode: string | null;
  orgName: string;
  status: string;
  updateTime: number;
}

interface GPSMapProps {
  language?: SupportedLanguage;
}

export function GPSMap({ language = 'th' }: GPSMapProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const t = mapTranslations[language];

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchLocation = async () => {
    try {
      const response = await fetch('/api/v1/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          // ในอนาคตถ้ามีระบบ Login ต้องเอา Token มาใส่ตรงนี้
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          User: "true",
          location: "true",
          deviceCode: "1000093"
        })
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const result = await response.json();
      console.log("GPS API Response:", result);
      
      if (result.code === 1000 && result.data && result.data.gpsX) {
        // ✅ กรณีที่ API จริงตอบกลับมาสำเร็จ (Auth ผ่าน)
        setLocationData(result.data);
        setLastUpdated(new Date());
        setIsError(false);
      } else if (result.code === 7000) {
        // กรณี Auth Failed (7000): เราจะแกล้งใช้ข้อมูลจริงที่คุณเตรียมไว้ให้ไปก่อน เพื่อให้ UI ทำงานได้
        console.log("API ติด Auth (7000) -> สลับมาใช้ข้อมูลจำลองชั่วคราวแทน");
        
        const mockData: LocationData = {
          deviceCategory: "1",
          deviceCode: "1000093",
          deviceName: "Bodycam",
          deviceType: "5",
          gpsX: 100.521467,
          gpsY: 13.718384,
          orgCode: null,
          orgName: "Test Location",
          status: "1",
          updateTime: 1773248077
        };

        setLocationData(mockData);
        setLastUpdated(new Date()); // อัปเดตเวลาเป็นปัจจุบันของเครื่องเราเอง
        setIsError(false);
      } else {
        throw new Error(`Data Error: ${JSON.stringify(result)}`);
      }
      
    } catch (error) {
      console.error("Failed to fetch location:", error);
      setIsError(true);
    }
  };

  // ดึงข้อมูลครั้งแรก และตั้งเวลา Polling ทุกๆ 10 วินาที
  useEffect(() => {
    fetchLocation(); // ดึงทันทีที่เปิดหน้า

    const intervalId = setInterval(() => {
      fetchLocation();
    }, 10000); // 10000 ms = 10 วินาที

    // ล้าง interval เมื่อผู้ใช้ออกจากหน้านี้
    return () => clearInterval(intervalId);
  }, []);

  // คำนวณ URL ของ OpenStreetMap
  const getMapUrl = () => {
    if (!locationData) {
      // ถ้าข้อมูลยังไม่มา ให้โชว์แผนที่กรุงเทพรวมๆ ไปก่อน
      return "https://www.openstreetmap.org/export/embed.html?bbox=100.4518%2C13.7063%2C100.5518%2C13.8063&layer=mapnik";
    }

    // คำนวณ Bounding Box ให้พิกัดอยู่ตรงกลางจอ
    const zoom = 0.005; // ปรับค่าน้อยลงเพื่อให้ซูมใกล้ขึ้น, ค่ามากขึ้นเพื่อซูมออก
    const minLon = locationData.gpsX - zoom;
    const minLat = locationData.gpsY - zoom;
    const maxLon = locationData.gpsX + zoom;
    const maxLat = locationData.gpsY + zoom;

    // ใส่พิกัดลงไปใน URL ของ Iframe
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik`;
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800">
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      
      {/* OpenStreetMap Static Iframe */}
      <iframe
        src={getMapUrl()}
        style={{ 
          border: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          filter: 'contrast(0.9) saturate(1.2)'
        }}
        title="GPS Map"
      />

      {/* ถ้ามีข้อมูล จะวางจุด Marker ไว้ตรงกึ่งกลาง */}
      {locationData && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative group cursor-pointer pointer-events-auto">
            {/* จุดกลมๆ */}
            <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center relative z-10">
               <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
            
            {/* Tooltip โชว์ข้อมูล */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-50">
              <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {locationData.deviceName} - {locationData.deviceCode}
                </p>
                <div className="text-xs text-blue-600 font-semibold mt-1 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div> 
                  ออนไลน์ (พิกัดล่าสุด)
                </div>
                {/* โชว์เวลาที่อัปเดตล่าสุด */}
                {lastUpdated && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    อัปเดต: {lastUpdated.toLocaleTimeString('th-TH')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ป้ายมุมซ้ายล่าง */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10">
        <p className="text-xs font-bold text-[#0c274b] dark:text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> {t.realTimeMap}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          {locationData ? `1 อุปกรณ์กำลังติดตาม` : `กำลังเชื่อมต่อสัญญาณ GPS...`}
        </p>
      </div>

      {/* ป้ายเตือนกรณี API Error */}
      {isError && (
        <div className="absolute top-4 left-4 bg-red-100 dark:bg-red-900/80 px-3 py-2 rounded-lg shadow border border-red-200 dark:border-red-800 z-10 flex items-center gap-2">
           <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
           <span className="text-xs font-bold text-red-600 dark:text-red-400">ขาดการเชื่อมต่อ GPS</span>
        </div>
      )}

      {/* ปุ่มขยายแผนที่ มุมขวาบน */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (locationData) {
              window.open(`https://www.openstreetmap.org/?mlat=${locationData.gpsY}&mlon=${locationData.gpsX}#map=16/${locationData.gpsY}/${locationData.gpsX}`, '_blank');
            } else {
              window.open('https://www.openstreetmap.org', '_blank');
            }
          }}
          className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs font-bold text-[#0c274b] dark:text-white border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
        >
          🗺️ เปิดแผนที่เต็ม
        </button>
      </div>
      
    </div>
  );
}