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

  const duration = event.end.diff(event.start, 'minute');
  const height = Math.max(30, Math.min(duration / 2, 100));

  return (
    <Resizable
      size={{ width: '95%', height }}
      onResizeStop={handleResize}
      enable={{ bottom: true }}
      minHeight={30}
    >
      <div
        ref={drag}
        className={`p-1 mb-1 rounded text-sm overflow-hidden ${
          isDragging ? 'opacity-50' : ''
        }`}
        onClick={onClick}
        style={{ backgroundColor: event.color, color: 'white' }}
      >
        <div className="font-bold truncate">{event.title}</div>
        <div className="text-xs">
          {event.start.format('HH:mm')} - {event.end.format('HH:mm')}
        </div>
      </div>
    </Resizable>
  );
};

export default EventBar;