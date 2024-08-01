import React, { createContext, useContext, useReducer } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarAction, CalendarState } from '../types';

const initialState: CalendarState = {
  events: [],
  resources: [{ id: '1', name: 'Resource A' }, { id: '2', name: 'Resource B' }, { id: '3', name: 'Resource C' }, { id: '4', name: 'Resource D' }, { id: '5', name: 'Resource E' }, { id: '6', name: 'Resource F' }, { id: '7', name: 'Resource G' }, { id: '8', name: 'Resource H' }, { id: '9', name: 'Resource I' }, { id: '10', name: 'Resource J' }, { id: '11', name: 'Resource K' }, { id: '12', name: 'Resource L' }, { id: '13', name: 'Resource M' }, { id: '14', name: 'Resource N' }, { id: '15', name: 'Resource O' }],
  currentDate: dayjs(),
};

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case 'ADD_RESOURCE':
      return { ...state, resources: [...state.resources, action.payload] };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    default:
      return state;
  }
};

const CalendarContext = createContext<{
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
  createEvent: (date: Dayjs, resource: string) => void;
} | null>(null);

const COLORS = ['#3788d8', '#ff9f89', '#8fbc8f', '#ffd700', '#ba55d3', '#20b2aa'];

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const createEvent = (date: Dayjs, resource: string) => {
    const newEvent: Event | any = {
      id: Date.now().toString(),
      title: 'New Event',
      description: '',
      start: date,
      end: date.endOf('day'),
      resource,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  };

  return (
    <CalendarContext.Provider value={{ state, dispatch, createEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};