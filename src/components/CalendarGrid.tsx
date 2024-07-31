import React from 'react';
import CalendarCell from './CalendarCell';
import { useCalendar } from '../context/CalenderContext';

interface CalendarGridProps {
  onCellDoubleClick: (date: Date, resource: string) => void;
  onEventClick: (event: Event) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ onCellDoubleClick, onEventClick }) => {
  const { state } = useCalendar();
  const { currentDate, resources } = state;

  const daysInMonth = currentDate.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-max border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Resource</th>
            {days.map((day) => (
              <th key={day} className="border p-2 w-20">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource: any) => (
            <tr key={resource.id}>
              <td className="border p-2 w-48">{resource.name}</td>
              {days.map((day) => (
                <CalendarCell
                  key={`${resource.id}-${day}`}
                  resource={resource}
                  date={currentDate.date(day).toDate()}
                  onDoubleClick={onCellDoubleClick}
                  onEventClick={onEventClick}
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