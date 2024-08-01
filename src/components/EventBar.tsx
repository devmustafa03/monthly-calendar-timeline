import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { useCalendar } from '../context/CalenderContext';
import { Event } from '../types';
import dayjs from 'dayjs';

interface EventBarProps {
  event: Event;
  onClick: () => void;
  cellWidth: number;
  onResize: (event: Event, newEnd: dayjs.Dayjs) => void;
  style?: React.CSSProperties;
}

const EventBar: React.FC<EventBarProps> = ({ event, onClick, cellWidth, onResize, style }) => {
  const eventRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(0);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'EVENT',
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const calculateWidth = useCallback(() => {
    const durationInMinutes = event.end.diff(event.start, 'minute');
    const minutesInDay = 24 * 60;
    return (durationInMinutes / minutesInDay) * cellWidth;
  }, [event.start, event.end, cellWidth]);

  useEffect(() => {
    setWidth(calculateWidth());
  }, [calculateWidth]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !eventRef.current) return;

    const eventRect = eventRef.current.getBoundingClientRect();
    const minutesPerPixel = (24 * 60) / cellWidth;
    const diffX = e.clientX - eventRect.right;
    const diffMinutes = Math.round(diffX * minutesPerPixel);

    const newEnd = event.end.add(diffMinutes, 'minute');
    if (newEnd.isAfter(event.start)) {
      onResize(event, newEnd);
    }
  }, [isResizing, event, cellWidth, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  const formatTime = (time: dayjs.Dayjs) => {
    return time.format('h:mm A'); // This will format the time with AM/PM
  };

  const hoverTitle = `${event.title}\nStart: ${formatTime(event.start)}\nEnd: ${formatTime(event.end)}`;

  return (
    <div
      ref={preview}
      className={`p-1 rounded text-sm overflow-hidden absolute ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onClick}
      style={{ 
        backgroundColor: event.color, 
        color: 'white',
        width: `${width}px`,
        height: '40px',
        left: '0',
        zIndex: 10,
        cursor: isResizing ? 'ew-resize' : 'move',
        ...style
      }}
      title={hoverTitle}
    >
      <div ref={eventRef}>
        <div ref={drag} className="h-full w-full">
          <div className="font-bold truncate">{event.title}</div>
          <div className="text-xs">
            {formatTime(event.start)} - {formatTime(event.end)}
          </div>
        </div>
        <div
          className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize"
          onMouseDown={handleResizeStart}
        />
      </div>
    </div>
  );
};

export default EventBar;