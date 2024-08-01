import React from 'react';
import { useDrag } from 'react-dnd';
import { useCalendar } from '../context/CalenderContext';

interface EventProps {
  event: {
    id: string;
    title: string;
    color: string;
  };
}

const Event: React.FC<EventProps> = ({ event }) => {
  const { dispatch } = useCalendar();

  const [{ isDragging }, drag] = useDrag({
    type: 'EVENT',
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: event.id });
    }
  };

  return (
    <div
      ref={drag}
      className={`p-1 mb-1 rounded text-sm ${event.color} ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => {
        console.log(event);
      }}
    >
      <span>{event.title}</span>
      <button onClick={handleDelete} className="ml-2 text-red-500">
        ×
      </button>
    </div>
  );
};

export default Event;
