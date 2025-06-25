
import React from 'react';
import { CalendarDay } from './CalendarDay';
import { Event, CalendarDay as CalendarDayType } from '@/types/calendar';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format
} from 'date-fns';

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventsForDay = (date: Date): Event[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.startDate === dateString);
  };

  const calendarData: CalendarDayType[] = calendarDays.map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate),
    isToday: isToday(date),
    events: getEventsForDay(date),
  }));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header with weekday names */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center font-medium text-sm text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarData.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};
