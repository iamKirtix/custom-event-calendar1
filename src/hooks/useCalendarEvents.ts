import { useState, useEffect } from 'react';
import { Event, EventFormData, RecurrencePattern } from '@/types/calendar';
import { 
  addDays, 
  addWeeks, 
  addMonths, 
  isAfter, 
  isBefore, 
  isEqual,
  parseISO,
  format
} from 'date-fns';

const STORAGE_KEY = 'calendar-events';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const generateRecurringEvents = (event: Event): Event[] => {
    if (!event.isRecurring || !event.recurrence) {
      return [event];
    }

    const recurringEvents: Event[] = [event];
    const { type, frequency, endDate, endAfterOccurrences, daysOfWeek } = event.recurrence;
    const startDate = parseISO(event.startDate);
    let currentDate = startDate;
    let occurrenceCount = 1;

    while (occurrenceCount < (endAfterOccurrences || 50)) {
      switch (type) {
        case 'daily':
          currentDate = addDays(currentDate, frequency);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, frequency);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, frequency);
          break;
        default:
          return recurringEvents;
      }

      if (endDate && isAfter(currentDate, parseISO(endDate))) {
        break;
      }

      const recurringEvent: Event = {
        ...event,
        id: `${event.id}-${occurrenceCount}`,
        startDate: format(currentDate, 'yyyy-MM-dd'),
        endDate: format(currentDate, 'yyyy-MM-dd'),
        parentEventId: event.id,
      };

      recurringEvents.push(recurringEvent);
      occurrenceCount++;
    }

    return recurringEvents;
  };

  const addEvent = (eventData: EventFormData) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData,
    };

    const eventsToAdd = eventData.isRecurring 
      ? generateRecurringEvents(newEvent)
      : [newEvent];

    setEvents(prev => [...prev, ...eventsToAdd]);
  };

  const updateEvent = (eventId: string, eventData: EventFormData) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, ...eventData }
        : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => {
      const eventToDelete = prev.find(e => e.id === eventId);
      if (eventToDelete?.parentEventId) {
        // Delete all recurring instances
        return prev.filter(e => e.parentEventId !== eventToDelete.parentEventId && e.id !== eventToDelete.parentEventId);
      }
      return prev.filter(e => e.id !== eventId);
    });
  };

  const rescheduleEvent = (eventId: string, newDate: string): { success: boolean; message?: string } => {
    const eventToReschedule = events.find(e => e.id === eventId);
    if (!eventToReschedule) {
      return { success: false, message: 'Event not found' };
    }

    // Check for conflicts
    const conflictingEvents = events.filter(e => 
      e.id !== eventId && 
      e.startDate === newDate &&
      e.startTime === eventToReschedule.startTime
    );

    if (conflictingEvents.length > 0) {
      // Allow the move but warn about conflicts
      console.warn(`Event moved to ${newDate} but conflicts with: ${conflictingEvents.map(e => e.title).join(', ')}`);
    }

    // Update the event's date
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, startDate: newDate, endDate: newDate }
        : event
    ));

    return { 
      success: true, 
      message: conflictingEvents.length > 0 
        ? `Event moved but conflicts with: ${conflictingEvents.map(e => e.title).join(', ')}` 
        : undefined 
    };
  };

  const getEventsForDate = (date: Date): Event[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.startDate === dateString);
  };

  const getEventsForDateRange = (startDate: Date, endDate: Date): Event[] => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate);
      return (isAfter(eventDate, startDate) || isEqual(eventDate, startDate)) &&
             (isBefore(eventDate, endDate) || isEqual(eventDate, endDate));
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    rescheduleEvent,
    getEventsForDate,
    getEventsForDateRange,
  };
};
