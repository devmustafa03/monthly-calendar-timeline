import React from 'react';
import useCalendar from '../hooks/useCalendar';
import dayjs from 'dayjs';

interface CalendarProps {
  onAddResource: () => void;
}

const CalendarHeader: React.FC<CalendarProps> = ({onAddResource}) => {
  const { state, dispatch } = useCalendar();

  const handlePrevMonth = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: state.currentDate.subtract(1, 'month') });
  };

  const handleNextMonth = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: state.currentDate.add(1, 'month') });
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-2xl text-blue-600 font-semibold">{state.currentDate.format('MMMM YYYY')}</h1>
      <div className='flex items-center'>
        <div className="flex items-center gap-4">
      <button onClick={() => onAddResource()} className="px-4 py-2 bg-green-500 text-white rounded">
        Add Resource
      </button>
        {/* < Today > */}
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 text-cyan-600 fill-cyan-600 focus:fill-cyan-200 cursor-pointer hover:fill-cyan-300' onClick={handlePrevMonth} viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path></svg>
        {/* Today */}
        <button onClick={() => dispatch({ type: 'SET_CURRENT_DATE', payload: dayjs() })} className="px-4 py-2 text-cyan-600 hover:text-cyan-300 font-bold rounded">
          Today
        </button>
        {/* < Next > */}
        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 text-cyan-600 fill-cyan-600 focus:fill-cyan-200 cursor-pointer hover:fill-cyan-300' onClick={handleNextMonth} viewBox="0 0 512 512"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path></svg>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
