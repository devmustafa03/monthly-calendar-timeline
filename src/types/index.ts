import { Dayjs } from 'dayjs';

export interface Event {
  id: string;
  title: string;
  description: string;
  start: Dayjs;
  end: Dayjs;
  resource: string;
  color: string;
  isInitial: boolean;
}

export interface Resource {
  id: string;
  name: string;
}

export interface CalendarState {
  events: Event[];
  resources: Resource[];
  currentDate: Dayjs;
}

export type CalendarAction =
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_RESOURCE'; payload: Resource }
  | { type: 'SET_CURRENT_DATE'; payload: Dayjs };

