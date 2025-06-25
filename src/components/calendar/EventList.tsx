
import React from 'react';
import { Event } from '@/types/calendar';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  const sortedEvents = events.sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events found for this month.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => (
        <Card 
          key={event.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onEventClick(event)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: event.color }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {format(parseISO(event.startDate), 'MMM dd, yyyy')}
                {event.startTime && ` at ${event.startTime}`}
                {event.endTime && ` - ${event.endTime}`}
              </div>
              
              {event.description && (
                <p className="text-sm">{event.description}</p>
              )}
              
              <div className="flex gap-2">
                {event.category && (
                  <Badge variant="secondary">{event.category}</Badge>
                )}
                {event.isRecurring && (
                  <Badge variant="outline">Recurring</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
