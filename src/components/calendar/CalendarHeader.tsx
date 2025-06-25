
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: 'month' | 'list';
  onViewChange: (view: 'month' | 'list') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onDateChange,
  view,
  onViewChange,
}) => {
  const goToPreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold text-foreground">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('month')}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Month
        </Button>
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('list')}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
      </div>
    </div>
  );
};
