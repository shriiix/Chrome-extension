import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, User, Clock, Calendar } from 'lucide-react';

const TimesheetUI = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedClient, setSelectedClient] = useState('Gaurav Golecha');
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showDayDetails, setShowDayDetails] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Sample clients data
    const clients = [
        { id: 1, name: 'Gaurav Golecha', avatar: 'G', color: 'bg-blue-500' },
        { id: 2, name: 'Dinesh Jain', avatar: 'D', color: 'bg-orange-500' },
        { id: 3, name: 'Santhapeta Vignesh', avatar: 'S', color: 'bg-gray-600' },
        { id: 4, name: 'Vinayak Baleghate', avatar: 'V', color: 'bg-orange-600' }
    ];

    // Sample timesheet data
    const timesheetData = {
        'Gaurav Golecha': {
            '2025-06-02': { hours: 6.02, tasks: [{ id: 'TSK-001', name: 'Database Design', hours: 3.5 }, { id: 'TSK-002', name: 'API Development', hours: 2.52 }] },
            '2025-06-03': { hours: 6.01, tasks: [{ id: 'TSK-003', name: 'Frontend Integration', hours: 6.01 }] },
            '2025-06-10': { hours: 6.02, tasks: [{ id: 'TSK-004', name: 'Testing & QA', hours: 6.02 }] },
            '2025-06-15': { hours: 6.02, tasks: [{ id: 'TSK-005', name: 'Bug Fixes', hours: 6.02 }] },
            '2025-06-25': { hours: 7.02, tasks: [{ id: 'TSK-006', name: 'Feature Development', hours: 4.5 }, { id: 'TSK-007', name: 'Code Review', hours: 2.52 }] },
            '2025-06-27': { hours: 7.02, tasks: [{ id: 'AD-805', name: 'PM Daily Operations - Project Amdital', hours: 7.02 }] }
        },
        'Dinesh Jain': {
            '2025-06-05': { hours: 8.00, tasks: [{ id: 'TSK-008', name: 'UI/UX Design', hours: 8.00 }] },
            '2025-06-12': { hours: 7.30, tasks: [{ id: 'TSK-009', name: 'Mockup Creation', hours: 7.30 }] }
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Get calendar data for current month
    const getCalendarData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    // Format date for data lookup
    const formatDateKey = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Get hours for a specific day
    const getHoursForDay = (day) => {
        if (!day) return null;
        const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
        const clientData = timesheetData[selectedClient];
        return clientData && clientData[dateKey] ? clientData[dateKey].hours : null;
    };

    // Get tasks for a specific day
    const getTasksForDay = (day) => {
        if (!day) return [];
        const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
        const clientData = timesheetData[selectedClient];
        return clientData && clientData[dateKey] ? clientData[dateKey].tasks : [];
    };

    // Navigate to previous week
    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    // Navigate to next week
    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    // Handle day click
    const handleDayClick = (day) => {
        if (day) {
            setSelectedDay(day);
            setShowDayDetails(true);
        }
    };

    // Get total hours for the week
    const getTotalHours = () => {
        const days = getCalendarData().filter(day => day !== null);
        return days.reduce((total, day) => {
            const hours = getHoursForDay(day);
            return total + (hours || 0);
        }, 0).toFixed(2);
    };

    // Check if day is today
    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const selectedClientData = clients.find(client => client.name === selectedClient);
    const menuRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="bg-white text-gray-800 w-[600px] h-[600px] rounded-lg p-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 ">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToPreviousWeek}
                            className="p-2 hover:bg-gray-400 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <h1 className="text-xl font-semibold">
                            {monthNames[currentDate.getMonth()]} • {getTotalHours()}
                        </h1>

                        <button
                            onClick={goToNextWeek}
                            className="p-2 hover:bg-gray-400 rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Client Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowClientDropdown(!showClientDropdown)}
                            className="flex items-center gap-2 font-sans bg-gray-200 hover:bg-gray-500 px-4 py-2 rounded-lg transition-colors"
                        >
                            <div className={`w-8 h-8 rounded-full ${selectedClientData?.color} flex items-center justify-center text-gray-800 font-semibold`}>
                                {selectedClientData?.avatar}
                            </div>
                            <span>{selectedClient}</span>
                            <ChevronDown size={16} />
                        </button>

                        {showClientDropdown && (
                            <div ref={menuRef} className="absolute right-0 top-full mt-2 bg-gray-400 border border-gray-900 rounded-lg shadow-lg z-10 min-w-64">
                                <div className="p-2 border-b border-gray-500">
                                    <div className="text-sm font-semibold text-gray-900 mb-2">SELECT MEMBER</div>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full bg-gray-500 text-gray-900 px-3 py-2 rounded border-none outline-none"
                                    />
                                </div>
                                <div ref={menuRef} className="max-h-64 overflow-y-auto">
                                    {clients.map((client) => (
                                        <button
                                            key={client.id}
                                            onClick={() => {
                                                setSelectedClient(client.name);
                                                setShowClientDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="relative">
                                                <div className={`w-8 h-8 rounded-full ${client.color} flex items-center justify-center text-white font-semibold`}>
                                                    {client.avatar}
                                                </div>
                                                {client.name === selectedClient && (
                                                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                                                )}
                                            </div>
                                            <span className="text-left">{client.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-gray-200 border-2 last:border-r-2 overflow-auto overflow-y-auto rounded-md">
                    {/* Day headers */}
                    <div className="grid grid-cols-8 border-b  border-black last:border-b-2">
                        <div className="bg-gray-200  last:border-b-2"></div>
                        {dayNames.map(day => (
                            <div key={day} className="bg-gray-200 text-center text-gray-800 text-xs border-gray-900 font-semibold py-1 px-2 last:border-r-2">
                                {day}
                            </div>
                        ))}
                        <div className="bg-gray-200 text-center text-gray-800 text-xs font-medium px-2">TOTALS</div>
                    </div>

                    {/* Calendar grid */}
                    <div>
                        {Array.from({ length: Math.ceil(getCalendarData().length / 7) }, (_, weekIndex) => {
                            const weekStart = weekIndex * 7;
                            const weekDays = getCalendarData().slice(weekStart, weekStart + 7);
                            const weekTotal = weekDays.reduce((total, day) => {
                                const hours = getHoursForDay(day);
                                return total + (hours || 0);
                            }, 0);

                            const firstDay = weekDays.find(d => d);
                            const lastDay = weekDays.filter(d => d).pop();

                            return (
                                <div key={weekIndex} className="grid grid-cols-8 border-b  border-black last:border-b-1">
                                    {/* Week range - vertical layout */}
                                    <div className="bg-gray-500 border-gray-900 text-gray-400 text-xs py-1 px-2  flex items-center justify-center">
                                        {firstDay && lastDay && (
                                            <div className="text-center leading-tight">
                                                <div className="text-gray-800 font-semibold text-xs mb-1">
                                                    {firstDay && lastDay && `Jun ${firstDay} - Jun ${lastDay}`}
                                                    <div className="text-white text-sm font-medium">
                                                        {weekTotal > 0 ? weekTotal.toFixed(2) : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Days */}
                                    {weekDays.map((day, dayIndex) => {
                                        const hours = getHoursForDay(day);
                                        const hasData = hours !== null;
                                        const todayClass = isToday(day) ? 'bg-gray-900 ring-2 ring-green-600' : '';

                                        return (
                                            <div
                                                key={dayIndex}
                                                onClick={() => handleDayClick(day)}
                                                className={`bg-gray-600 hover:bg-gray-700 cursor-pointer transition-colors ${todayClass} py-1 px-2 
                                                             border-b border-r border-gray-600 flex flex-col items-center justify-center min-h-16`}
                                            >
                                                <div className="text-xs text-gray-400 mb-1">
                                                    {String(day || '').padStart(2, '0')}
                                                </div>
                                                <div className="text-white text-sm font-medium">
                                                    {hasData ? hours.toFixed(2) : '-'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-gray-500 p-1 border-t border-gray-600">
                        <div className="text-gray-400 text-xs">
                            Click a calendar cell to view daily details.
                        </div>
                    </div>
                </div>

                {/* Day Details Modal */}
                {showDayDetails && selectedDay && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-400 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Calendar size={20} />
                                    {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
                                </h2>
                                <button
                                    onClick={() => setShowDayDetails(false)}
                                    className="text-white hover:text-gray-900"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 font-semibold text-gray-900">
                                    <User size={16} />
                                    <span>Client: {selectedClient}</span>
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-gray-900">
                                    <Clock size={16} />
                                    <span>Total Hours: {getHoursForDay(selectedDay)?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3">Tasks</h3>
                                    <div>
                                        {getTasksForDay(selectedDay).map((task, index) => (
                                            <div key={index} className="bg-gray-500 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{task.name}</div>
                                                        <div className="text-sm text-gray-900">ID: {task.id}</div>
                                                    </div>
                                                    <div className="text-gray-900 font-medium">
                                                        {task.hours.toFixed(2)}h
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {getTasksForDay(selectedDay).length === 0 && (
                                            <div className="text-gray-900 text-center py-4">
                                                No tasks recorded for this day
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimesheetUI;