import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Event } from '../types';
import useCalendar from '../hooks/useCalendar';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { state, dispatch } = useCalendar();
  const [formData, setFormData] = useState<Event | any>({
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter event description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                id="start"
                type="datetime-local"
                value={formData.start.format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setFormData({ ...formData, start: dayjs(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                id="end"
                type="datetime-local"
                value={formData.end.format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setFormData({ ...formData, end: dayjs(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="resource" className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
            <select
              id="resource"
              value={formData.resource}
              onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a resource</option>
              {state.resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Event Color</label>
            <div className="flex items-center">
              <input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 border border-gray-300 rounded-md mr-2"
              />
              <span className="text-sm text-gray-600">{formData.color}</span>
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 w-[30%] text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
              Update
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 w-[30%] text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
            >
              Delete
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-300 hover:bg-gray-400 w-[30%] text-gray-800 px-4 py-2 rounded-md transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;