import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Resource, Event } from '../types';
import useCalendar from '../hooks/useCalendar';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import EventBar from './EventBar';

dayjs.extend(isBetween);

interface CalendarCellProps {
  resource: Resource;
  date: dayjs.Dayjs;
  onEventClick: (event: Event) => void;
  cellWidth: number;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ resource, date, onEventClick, cellWidth }) => {
  const { state, dispatch, createEvent } = useCalendar();
  const [cellHeight, setCellHeight] = useState(70);
  const cellRef = useRef<any>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'EVENT',
    drop: (item: { id: string; isInitial: boolean }, monitor) => {
      const event = state.events.find((e) => e.id === item.id);
      if (event && cellRef.current) {
        const cellRect = cellRef.current.getBoundingClientRect();
        const dropClientOffset = monitor.getClientOffset();

        if (dropClientOffset) {
          const dropPosition = (dropClientOffset.x - cellRect.left) / cellWidth;
          const minutesFromStart = Math.floor(dropPosition * 24 * 60);
          const newStart = date.startOf('day').add(minutesFromStart, 'minute');
          const duration = event.end.diff(event.start, 'minute');

          dispatch({
            type: 'UPDATE_EVENT',
            payload: { 
              ...event, 
              start: newStart,
              end: event.isInitial ? newStart.add(1500, 'minute') : newStart.add(duration, 'minute'),
              resource: resource.id,
              isInitial: false
            },
          });
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const cellEvents = state.events.filter(
    (event) => event.resource === resource.id && date.isSame(event.start, 'day')
  );

  const sortedEvents = [...cellEvents].sort((a, b) => a.start.diff(b.start));

  const calculateEventPositions = (events: Event[]) => {
    const positions: { [key: string]: { row: number; overlappingEvents: number } } = {};
    const rows: Event[][] = [];

    events.forEach((event) => {
      let row = 0;
      const condition = true;
      while (condition) {
        if (!rows[row]) {
          rows[row] = [];
        }
        const canFit = rows[row].every(existingEvent => 
          !event.start.isBefore(existingEvent.end) || !event.end.isAfter(existingEvent.start)
        );
        if (canFit) {
          rows[row].push(event);
          positions[event.id] = { row, overlappingEvents: rows[row].length };
          break;
        }
        row++;
      }
    });

    return { positions, totalRows: rows.length };
  };

  const { positions, totalRows } = calculateEventPositions(sortedEvents);

  useEffect(() => {
    const newHeight = Math.max(70, totalRows * 50);
    setCellHeight(newHeight);
  }, [totalRows]);

  const handleDoubleClick = (e: React.MouseEvent<HTMLTableDataCellElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const minutesFromStart = Math.floor((offsetX / cellWidth) * 24 * 60);
    const startTime = date.startOf('day').add(minutesFromStart, 'minute');

    const existingEvent = cellEvents.find(event => 
      startTime.isBetween(event.start, event.end, null, '[)')
    );

    if (existingEvent) {
      onEventClick(existingEvent);
    } else {
      createEvent(startTime, resource.id);
    }
  };

  const handleResize = useCallback((event: Event, newStart: dayjs.Dayjs, newEnd: dayjs.Dayjs) => {
    dispatch({
      type: 'UPDATE_EVENT',
      payload: { ...event, start: newStart, end: newEnd, isInitial: false },
    });
  }, [dispatch]);

  return (
    <td
      ref={(node) => {
        cellRef.current = node;
        drop(node);
      }}
      className={`border p-2 ${isOver ? 'bg-gray-200' : ''} relative`}
      onDoubleClick={handleDoubleClick}
      style={{ height: `${cellHeight}px`, minWidth: `${cellWidth}px`, transition: 'height 0.3s ease' }}
    >
      {sortedEvents.map((event: Event) => (
        <EventBar 
          key={event.id} 
          event={event} 
          onClick={() => onEventClick(event)} 
          cellWidth={cellWidth}
          onResize={handleResize}
          cellStart={date.startOf('day')}
          isInitial={event.isInitial}
          position={positions[event.id]}
          totalRows={totalRows}
        />
      ))}
    </td>
  );
};

export default CalendarCell;