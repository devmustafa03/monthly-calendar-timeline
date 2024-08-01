import React, { useRef, useEffect, useState } from 'react';
import CalendarCell from './CalendarCell';
import useCalendar from '../hooks/useCalendar';
import dayjs from 'dayjs';

interface CalendarGridProps {
  onEventClick: (event: Event) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ onEventClick }) => {
  const { state } = useCalendar();
  const { currentDate, resources } = state;
  const [cellWidth, setCellWidth] = useState(100);
  const cellRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    if (cellRef.current) {
      setCellWidth(cellRef.current.offsetWidth);
    }
  }, []);

  const daysInMonth = currentDate.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => currentDate.date(i + 1));

  const getDayName = (date: dayjs.Dayjs) => {
    return date.format('ddd');
  };

  const isToday = (date: dayjs.Dayjs) => {
    return date.isSame(dayjs(), 'day');
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-max border-collapse" style={{ position: 'relative' }}>
        <thead>
          <tr>
            <th className="border p-1"></th>
            {days.map((day) => (
              <th key={day.date()} className={`border p-1 w-12 text-sm font-normal text-left`}>
                <div className={`${isToday(day) ? 'bg-[#007aff] px-3 pt-1 text-white rounded-3xl w-fit' : ''}`}>
                {day.date()}{" "}{getDayName(day)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource: any) => (
            <tr key={resource.id}>
              <td className="border p-2 w-48 font-semibold">{resource.name}</td>
              {days.map((day) => (
                <CalendarCell
                  key={`${resource.id}-${day}`}
                  resource={resource}
                  date={currentDate.date(day.date())}
                  onEventClick={(e: Event | any) => onEventClick(e)}
                  cellWidth={cellWidth}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarGrid;