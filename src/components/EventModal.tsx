import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useCalendar } from '../context/CalenderContext';
import { Event } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  date: Date | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, date }) => {
  const { dispatch } = useCalendar();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: dayjs(),
    end: dayjs().endOf('day'),
    resource: '',
    color: '#3788d8',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        resource: event.resource,
        color: event.color,
      });
    } else if (date) {
      setFormData({
        ...formData,
        start: dayjs(date),
        end: dayjs(date).endOf('day'),
      });
    }
  }, [event, date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      dispatch({
        type: 'UPDATE_EVENT',
        payload: { ...event, ...formData },
      });
    } else {
      dispatch({
        type: 'ADD_EVENT',
        payload: { ...formData, id: Date.now().toString() },
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (event && window.confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: event.id });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="start" className="block text-gray-700 font-bold mb-2">
              Start
            </label>
            <input
              type="datetime-local"
              id="start"
              value={formData.start.format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setFormData({ ...formData, start: dayjs(e.target.value) })}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end" className="block text-gray-700 font-bold mb-2">
              End
            </label>
            <input
              type="datetime-local"
              id="end"
              value={formData.end.format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setFormData({ ...formData, end: dayjs(e.target.value) })}
              className="border p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {event ? 'Update' : 'Create'}
          </button>
          {event && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Delete
            </button>
          )}
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
