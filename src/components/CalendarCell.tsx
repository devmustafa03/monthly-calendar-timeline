import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { Resource, Event } from '../types';
import { useCalendar } from '../context/CalenderContext';
import dayjs from 'dayjs';
import EventBar from './EventBar';

interface CalendarCellProps {
  resource: Resource;
  date: dayjs.Dayjs;
  onEventClick: (event: Event) => void;
  cellWidth: number;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ resource, date, onEventClick, cellWidth }) => {
  const { state, dispatch, createEvent } = useCalendar();

  const [{ isOver }, drop] = useDrop({
    accept: 'EVENT',
    drop: (item: { id: string }) => {
      const event = state.events.find((e) => e.id === item.id);
      if (event) {
        const duration = event.end.diff(event.start, 'minute');
        dispatch({
          type: 'UPDATE_EVENT',
          payload: { 
            ...event, 
            start: date.hour(event.start.hour()).minute(event.start.minute()),
            end: date.hour(event.start.hour()).minute(event.start.minute()).add(duration, 'minute'),
            resource: resource.id 
          },
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
      date.isSame(event.start, 'day')
  );

  const handleDoubleClick = () => {
    createEvent(date, resource.id);
  };

  const handleResize = useCallback((event: Event, newEnd: dayjs.Dayjs) => {
    dispatch({
      type: 'UPDATE_EVENT',
      payload: { ...event, end: newEnd },
    });
  }, [dispatch]);

  return (
    <td
      ref={drop}
      className={`border p-2 ${isOver ? 'bg-gray-200' : ''} relative`}
      onDoubleClick={handleDoubleClick}
      style={{ height: '100px', minWidth: `${cellWidth}px` }}
    >
      {cellEvents.map((event: Event) => (
        <EventBar 
          key={event.id} 
          event={event} 
          onClick={() => onEventClick(event)} 
          cellWidth={cellWidth}
          onResize={handleResize}
        />
      ))}
    </td>
  );
};

export default CalendarCell;