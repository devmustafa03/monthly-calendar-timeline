import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { Event } from '../types';
import dayjs from 'dayjs';

interface EventBarProps {
  event: Event;
  onClick: () => void;
  cellWidth: number;
  onResize: (event: Event, newStart: dayjs.Dayjs, newEnd: dayjs.Dayjs) => void;
  cellStart: dayjs.Dayjs;
  isInitial: boolean;
  overlap: number;
  maxOverlap: number;
  index: number;
}

const EventBar: React.FC<EventBarProps> = ({ 
  event, 
  onClick, 
  cellWidth, 
  onResize, 
  cellStart, 
  isInitial,
  overlap,
  maxOverlap,
  index
}) => {
  const eventRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState<'start' | 'end' | null>(null);
  const [position, setPosition] = useState({ left: 0, width: cellWidth, top: 0 });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'EVENT',
    item: { id: event.id, type: 'EVENT', isInitial },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const calculatePosition = useCallback(() => {
    if (isInitial) {
      setPosition({ left: 0, width: cellWidth, top: index * 45 });
    } else {
      const startOfDay = cellStart.startOf('day');
      const eventStart = event.start;
      const eventEnd = event.end;
      const minutesFromStartOfDay = eventStart.diff(startOfDay, 'minute');
      const durationInMinutes = eventEnd.diff(eventStart, 'minute');
      const minutesInDay = 24 * 60;

      const left = (minutesFromStartOfDay / minutesInDay) * cellWidth;
      const width = (durationInMinutes / minutesInDay) * cellWidth;
      const top = (index % maxOverlap) * 45;

      setPosition({ left, width, top });
    }
  }, [event.start, event.end, cellWidth, cellStart, isInitial, index, maxOverlap]);

  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  const handleResizeStart = (e: React.MouseEvent, type: 'start' | 'end') => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(type);
  };

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !eventRef.current) return;

    const eventRect = eventRef.current.getBoundingClientRect();
    const minutesPerPixel = (24 * 60) / cellWidth;
    
    if (isResizing === 'start') {
      const diffX = e.clientX - eventRect.left;
      const diffMinutes = Math.round(diffX * minutesPerPixel);
      const newStart = event.start.add(diffMinutes, 'minute');
      if (newStart.isBefore(event.end)) {
        onResize(event, newStart, event.end);
      }
    } else {
      const diffX = e.clientX - eventRect.right;
      const diffMinutes = Math.round(diffX * minutesPerPixel);
      const newEnd = event.end.add(diffMinutes, 'minute');
      if (newEnd.isAfter(event.start)) {
        onResize(event, event.start, newEnd);
      }
    }
  }, [isResizing, event, cellWidth, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(null);
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
    return time.format('h:mm A');
  };

  const hoverTitle = `${event.title}\nStart: ${formatTime(event.start)}\nEnd: ${formatTime(event.end)}`;

  return (
    <div
      ref={preview}
      className={`absolute rounded text-sm overflow-hidden ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onClick}
      style={{ 
        backgroundColor: event.color, 
        color: 'white',
        width: `${position.width}px`,
        height: '40px',
        left: `${position.left}px`,
        top: `${position.top + 6}px`,
        zIndex: 10 + index,
        cursor: isResizing ? 'ew-resize' : 'move',
      }}
      title={hoverTitle}
    >
      <div ref={eventRef} className="h-full w-full relative p-1">
        <div ref={drag} className="h-full w-full">
          <div className="font-bold truncate">{event.title}</div>
          <div className="text-xs">
            {formatTime(event.start)} - {formatTime(event.end)}
          </div>
        </div>
        <div
          className="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, 'start')}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize"
          onMouseDown={(e) => handleResizeStart(e, 'end')}
        />
      </div>
    </div>
  );
};

export default EventBar;