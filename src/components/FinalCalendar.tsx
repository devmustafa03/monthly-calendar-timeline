import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';
import { CalendarProvider } from '../context/CalenderContext';
import ResourceModal from './ResourceModal';

const FinalCalendar: React.FC = () => {
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <CalendarProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="h-screen flex flex-col">
          <CalendarHeader onAddResource={() => setResourceModalOpen(true)} />
          <CalendarGrid
            onCellDoubleClick={(date: any) => {
              setSelectedDate(date);
              setSelectedEvent(null);
              setEventModalOpen(true);
            }}
            onEventClick={(event: any) => {
              setSelectedEvent(event);
              setEventModalOpen(true);
            }}
          />
          <EventModal
            isOpen={eventModalOpen}
            onClose={() => setEventModalOpen(false)}
            event={selectedEvent}
            date={selectedDate}
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