import React from 'react';
import { useDrag } from 'react-dnd';
import { Resizable } from 're-resizable';
import { useCalendar } from '../context/CalenderContext';
import { Event } from '../types';

interface EventBarProps {
  event: Event;
  onClick: () => void;
}

const EventBar: React.FC<EventBarProps> = ({ event, onClick }) => {
  const { dispatch } = useCalendar();

  const [{ isDragging }, drag] = useDrag({
    type: 'EVENT',
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleResize = (e: any, direction: any, ref: any, d: any) => {
    const newEnd = event.end.add(d.height, 'minute');
    dispatch({
      type: 'UPDATE_EVENT',
      payload: { ...event, end: newEnd },
    });
  };

  return (
    <Resizable
      size={{ width: '100%', height: event.end.diff(event.start, 'minute') }}
      onResizeStop={handleResize}
      enable={{ bottom: true }}
      minHeight={30}
    >
      <div
        ref={drag}
        className={`p-1 mb-1 rounded text-black text-sm ${event.color} ${
          isDragging ? 'opacity-50' : ''
        }`}
        onClick={onClick}
      >
        <span>{event.title}</span>
        <span className="float-right">{event.start.format('HH:mm')} - {event.end.format('HH:mm')}</span>
      </div>
    </Resizable>
  );
};

export default EventBar;