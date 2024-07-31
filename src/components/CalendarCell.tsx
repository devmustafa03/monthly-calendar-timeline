import React from 'react';
import { useDrop } from 'react-dnd';
import { Resource } from '../types';
import { useCalendar } from '../context/CalenderContext';
import dayjs from 'dayjs';
import EventBar from './EventBar';

interface CalendarCellProps {
  resource: Resource;
  date: Date;
  onDoubleClick: (date: Date, resource: string) => void;
  onEventClick: (event: Event) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ resource, date, onDoubleClick, onEventClick }) => {
  const { state, dispatch } = useCalendar();

  const [{ isOver }, drop] = useDrop({
    accept: 'EVENT',
    drop: (item: { id: string }) => {
      const event = state.events.find((e) => e.id === item.id);
      if (event) {
        dispatch({
          type: 'UPDATE_EVENT',
          payload: { ...event, start: dayjs(date), end: dayjs(date).endOf('day'), resource: resource.id },
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const cellEvents = state.events.filter(
    (event) =>
      event.resource === resource.id &&
      event.start.isSame(date, 'day')
  );

  return (
    <td
      ref={drop}
      className={`border p-2 ${isOver ? 'bg-gray-200' : ''}`}
      onDoubleClick={() => onDoubleClick(date, resource.id)}
    >
      {cellEvents.map((event: any) => (
        <EventBar key={event.id} event={event} onClick={() => onEventClick(event)} />
      ))}
    </td>
  );
};

export default CalendarCell;
