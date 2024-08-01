import React from 'react';
import { useDrop } from 'react-dnd';
import { Resource } from '../types';
import { useCalendar } from '../context/CalenderContext';
import dayjs from 'dayjs';
import EventBar from './EventBar';

interface CalendarCellProps {
  resource: Resource;
  date: dayjs.Dayjs;
  // onDoubleClick: (date: Date, resource: string) => void;
  onEventClick: (event: Event) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ resource, date, onEventClick }) => {
  const { state, dispatch, createEvent } = useCalendar();

  const [{ isOver }, drop] = useDrop({
    accept: 'EVENT',
    drop: (item: { id: string }) => {
      const event = state.events.find((e) => e.id === item.id);
      if (event) {
        dispatch({
          type: 'UPDATE_EVENT',
          payload: { ...event, start: date, end: date.endOf('day'), resource: resource.id },
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

  const handleDoubleClick = () => {
    createEvent(date, resource.id);
  };

  return (
    <td
      ref={drop}
      className={`border p-2 ${isOver ? 'bg-gray-200' : ''} relative`}
      onDoubleClick={handleDoubleClick}
      style={{ height: '100px', minWidth: '150px' }}
    >
      {cellEvents.map((event: Event | any) => (
        <EventBar key={event.id} event={event} onClick={() => onEventClick(event)} />
      ))}
    </td>
  );
};

export default CalendarCell;