import React, { createContext, useReducer, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarAction, CalendarState, Event } from '../types';

const LOCAL_STORAGE_KEY = 'calendarState';

const initialState: CalendarState = {
  events: [],
  resources: [
    { id: '1', name: 'Resource A' }, { id: '2', name: 'Resource B' }, 
    { id: '3', name: 'Resource C' }, { id: '4', name: 'Resource D' }, 
    { id: '5', name: 'Resource E' }, { id: '6', name: 'Resource F' }, 
    { id: '7', name: 'Resource G' }, { id: '8', name: 'Resource H' }, 
    { id: '9', name: 'Resource I' }, { id: '10', name: 'Resource J' }, 
    { id: '11', name: 'Resource K' }, { id: '12', name: 'Resource L' }, 
    { id: '13', name: 'Resource M' }, { id: '14', name: 'Resource N' }, 
    { id: '15', name: 'Resource O' }
  ],
  currentDate: dayjs(),
};

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  let newState: CalendarState;

  switch (action.type) {
    case 'ADD_EVENT':
      newState = { ...state, events: [...state.events, action.payload] };
      break;
    case 'UPDATE_EVENT':
      newState = {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
      break;
    case 'DELETE_EVENT':
      newState = {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
      break;
    case 'ADD_RESOURCE':
      newState = { ...state, resources: [...state.resources, action.payload] };
      break;
    case 'SET_CURRENT_DATE':
      newState = { ...state, currentDate: action.payload };
      break;
    default:
      return state;
  }

  // Save the new state to local storage
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  return newState;
};

export const CalendarContext = createContext<{
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
  createEvent: (date: Dayjs, resource: string) => void;
} | null>(null);

const COLORS = ['#3788d8', '#ff9f89', '#8fbc8f', '#ffd700', '#ba55d3', '#20b2aa'];

const loadStateFromLocalStorage = (): CalendarState => {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      ...parsedState,
      events: parsedState.events.map((event: any) => ({
        ...event,
        start: dayjs(event.start),
        end: dayjs(event.end),
      })),
      currentDate: dayjs(parsedState.currentDate),
    };
  }
  return initialState;
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState, loadStateFromLocalStorage);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const createEvent = (date: Dayjs, resource: string) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: 'New Event',
      description: '',
      start: date,
      end: date.add(1, 'hour'),
      resource,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      isInitial: true,
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  };

  return (
    <CalendarContext.Provider value={{ state, dispatch, createEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};