import React, { createContext, useContext, useReducer } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarAction, CalendarState } from '../types';

const initialState: CalendarState = {
  events: [],
  resources: [{ id: '1', name: 'Resource A' }],
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