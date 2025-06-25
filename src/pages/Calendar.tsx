
import React, { useState, useEffect } from 'react';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventForm } from '@/components/calendar/EventForm';
import { EventList } from '@/components/calendar/EventList';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { Event, EventFormData } from '@/types/calendar';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [view, setView] = useState<'month' | 'list'>('month');

  const { toast } = useToast();

  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    rescheduleEvent,
    getEventsForDateRange
  } = useCalendarEvents();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthEvents = getEventsForDateRange(monthStart, monthEnd);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.startDate));
    setShowEventForm(true);
  };

  const handleEventSubmit = (eventData: EventFormData) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setShowEventForm(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleEventDelete = (eventId: string) => {
    deleteEvent(eventId);
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleEventDrop = (eventId: string, newDate: string) => {
    const result = rescheduleEvent(eventId, newDate);
    
    if (result.success) {
      if (result.message) {
        toast({
          title: "Event Rescheduled",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Event Rescheduled",
          description: "Event has been moved successfully.",
        });
      }
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to reschedule event.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <CalendarHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          view={view}
          onViewChange={setView}
        />
        
        <div className="mt-6">
          {view === 'month' ? (
            <CalendarGrid
              currentDate={currentDate}
              events={monthEvents}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
            />
          ) : (
            <EventList
              events={monthEvents}
              onEventClick={handleEventClick}
            />
          )}
        </div>

        {showEventForm && (
          <EventForm
            event={selectedEvent}
            selectedDate={selectedDate}
            onSubmit={handleEventSubmit}
            onDelete={selectedEvent ? () => handleEventDelete(selectedEvent.id) : undefined}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
