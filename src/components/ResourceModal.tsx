import React, { useState } from 'react';
import { useCalendar } from '../context/CalenderContext';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResourceModal: React.FC<ResourceModalProps> = ({ isOpen, onClose }) => {
  const { dispatch } = useCalendar();
  const [resourceName, setResourceName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_RESOURCE',
      payload: { id: Date.now().toString(), name: resourceName },
    });
    setResourceName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Add Resource</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="Resource Name"
            className="border p-2 mb-2 w-full"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Resource
          </button>
          <button
            type="button"
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;