// ✅ src/components/timer/TimerPanel.jsx (Fixed real-time sync and Back button logic)
import React, { useEffect, useState } from 'react';
import { fetchAttendance, updateAttendance } from '../../services/timerService';
import WorkTimer from './WorkTimer';
import BreakTimer from './BreakTimer';

const TimerPanel = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());

  const loadAttendance = async () => {
    setLoading(true);
    const data = await fetchAttendance();
    console.log("🕒 Loaded Attendance:", data);
    setAttendance(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAttendance();
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (type) => {
    const updated = await updateAttendance(type, attendance);
    if (updated?.success) await loadAttendance();
    else setError(updated?.message || 'Action failed');
  };

  const getWorkSeconds = () => {
    if (!attendance?.check_in_time || attendance.last_activity_type === 'checkout') return 0;
    const start = new Date(attendance.check_in_time).getTime();
    const end = new Date(attendance?.check_out_time || now).getTime();
    const breakMs = attendance.total_break ? parseDuration(attendance.total_break) * 1000 : 0;
    return Math.floor((end - start - breakMs) / 1000);
  };

  const getBreakSeconds = () => {
    const latestBreak = attendance?.break_logs?.slice(-1)[0];
    const isBreak = attendance?.last_activity_type === 'break';
    if (!latestBreak || !isBreak || !latestBreak.break_start_time || latestBreak.break_end_time) return 0;
    const start = new Date(latestBreak.break_start_time).getTime();
    return Math.floor((now - start) / 1000);
  };

  const parseDuration = (str) => {
    const [h = 0, m = 0, s = 0] = str.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  };

  const isCheckedOut = attendance?.last_activity_type === 'checkout';
  const isBreak = attendance?.last_activity_type === 'break';
  const hasCheckedIn = attendance?.check_in_time && !isCheckedOut;

  return (
    <div className="px-4 py-4 border-y border-gray-200 bg-gray-100 flex flex-col items-center rounded-b-md">
      {/* Timers */}
      <div className="flex justify-center items-center gap-10 mb-4">
        <div className="text-center">
          <div className="text-[12px] text-gray-500 font-medium mb-1">Work Timer</div>
          <WorkTimer seconds={getWorkSeconds()} />
        </div>
        <div className="text-center">
          <div className="text-[12px] text-gray-500 font-medium mb-1">Break Timer</div>
          <BreakTimer seconds={getBreakSeconds()} />
        </div>
      </div>

      {/* Dual Buttons */}
      <div className="flex gap-6">
        {hasCheckedIn && (
          <button
            onClick={() => handleAction(isBreak ? 'back' : 'break')}
            className={`px-6 py-2 rounded-full text-white font-semibold text-sm transition ${
              isBreak ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isBreak ? 'Back' : 'Break'}
          </button>
        )}

        {!isCheckedOut && attendance?.id && (
          <button
            onClick={() => handleAction('checkout')}
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm"
          >
            Check Out
          </button>
        )}

        {!attendance?.id && (
          <button
            onClick={() => handleAction('checkin')}
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm"
          >
            Check In
          </button>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
    </div>
  );
};

export default TimerPanel;
