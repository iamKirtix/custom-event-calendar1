
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  color: string;
  category?: string;
  recurrence?: RecurrencePattern;
  isRecurring: boolean;
  parentEventId?: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency: number;
  daysOfWeek?: number[];
  endDate?: string;
  endAfterOccurrences?: number;
}

export interface EventFormData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  color: string;
  category?: string;
  recurrence?: RecurrencePattern;
  isRecurring: boolean;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}
