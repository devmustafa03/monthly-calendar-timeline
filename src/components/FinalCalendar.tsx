import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';
import ResourceModal from './ResourceModal';
import { Event } from '../types';
import { CalendarProvider } from '../context/CalenderContext';

const FinalCalendar: React.FC = () => {
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  return (
    <CalendarProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="h-screen flex flex-col">
          <CalendarHeader onAddResource={() => setResourceModalOpen(true)} />
          <CalendarGrid onEventClick={(e: Event | any) =>handleEventClick(e)} />
          <EventModal
            isOpen={eventModalOpen}
            onClose={() => {
              setEventModalOpen(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
          />
          <ResourceModal
            isOpen={resourceModalOpen}
            onClose={() => setResourceModalOpen(false)}
          />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
};

export default FinalCalendar;
