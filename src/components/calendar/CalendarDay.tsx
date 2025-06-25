
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CalendarDay as CalendarDayType, Event } from '@/types/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  day: CalendarDayType;
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onDateClick,
  onEventClick,
}) => {
  const handleDateClick = () => {
    onDateClick(day.date);
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event);
  };

  return (
    <div
      className={cn(
        "min-h-[120px] border-r border-b p-2 cursor-pointer hover:bg-gray-50 transition-colors",
        !day.isCurrentMonth && "bg-gray-50 text-muted-foreground",
        day.isToday && "bg-blue-50 border-blue-200"
      )}
      onClick={handleDateClick}
    >
      <div className={cn(
        "text-sm font-medium mb-1",
        day.isToday && "text-blue-600"
      )}>
        {format(day.date, 'd')}
      </div>
      
      <div className="space-y-1">
        {day.events.slice(0, 3).map((event, index) => (
          <Draggable 
            key={event.id} 
            draggableId={`event-${event.id}`} 
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={cn(
                  "text-xs p-1 rounded text-white cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity",
                  "truncate",
                  snapshot.isDragging && "shadow-lg"
                )}
                style={{
                  backgroundColor: event.color,
                  ...provided.draggableProps.style,
                }}
                onClick={(e) => handleEventClick(event, e)}
              >
                {event.title}
              </div>
            )}
          </Draggable>
        ))}
        {day.events.length > 3 && (
          <div className="text-xs text-muted-foreground">
            +{day.events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
