import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useCalendar } from '../context/CalenderContext';
import { Event } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { state, dispatch } = useCalendar();
  const [formData, setFormData] = useState<Event>({
    id: '',
    title: '',
    description: '',
    start: dayjs(),
    end: dayjs().endOf('day'),
    resource: '',
    color: '#3788d8',
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      dispatch({
        type: 'UPDATE_EVENT',
        payload: formData,
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
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Event Title"
            className="border p-2 mb-2 w-full"
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Event Description"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="datetime-local"
            value={formData.start.format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => setFormData({ ...formData, start: dayjs(e.target.value) })}
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="datetime-local"
            value={formData.end.format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => setFormData({ ...formData, end: dayjs(e.target.value) })}
            className="border p-2 mb-2 w-full"
            required
          />
          <select
            value={formData.resource}
            onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
            className="border p-2 mb-2 w-full"
            required
          >
            {state.resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;