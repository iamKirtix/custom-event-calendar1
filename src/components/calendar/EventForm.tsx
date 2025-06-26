
import React, { useState, useEffect } from 'react';
import { Event, EventFormData } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface EventFormProps {
  event?: Event | null;
  selectedDate?: Date | null;
  onSubmit: (eventData: EventFormData) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  selectedDate,
  onSubmit,
  onDelete,
  onClose,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    endDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    color: '#3b82f6',
    category: '',
    isRecurring: false,
  });

  const weekDays = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime || '09:00',
        endTime: event.endTime || '10:00',
        color: event.color,
        category: event.category || '',
        isRecurring: event.isRecurring,
        recurrence: event.recurrence,
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecurrenceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [field]: value,
      }
    }));
  };

  const handleWeekDayToggle = (dayValue: number, checked: boolean) => {
    const currentDays = formData.recurrence?.daysOfWeek || [];
    const newDays = checked
      ? [...currentDays, dayValue].sort()
      : currentDays.filter(day => day !== dayValue);
    
    handleRecurrenceChange('daysOfWeek', newDays);
  };

  const isWeekDaySelected = (dayValue: number) => {
    return formData.recurrence?.daysOfWeek?.includes(dayValue) || false;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="color">Event Color</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => {
                handleInputChange('isRecurring', checked);
                if (checked && !formData.recurrence) {
                  handleInputChange('recurrence', {
                    type: 'weekly',
                    frequency: 1,
                    daysOfWeek: [],
                  });
                }
              }}
            />
            <Label htmlFor="recurring">Recurring Event</Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
              <div>
                <Label htmlFor="recurrenceType">Recurrence Type</Label>
                <Select
                  value={formData.recurrence?.type || 'weekly'}
                  onValueChange={(value) => 
                    handleRecurrenceChange('type', value as 'daily' | 'weekly' | 'monthly' | 'custom')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="frequency">
                  Repeat every {formData.recurrence?.frequency || 1} {formData.recurrence?.type || 'week'}(s)
                </Label>
                <Input
                  id="frequency"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.recurrence?.frequency || 1}
                  onChange={(e) => handleRecurrenceChange('frequency', parseInt(e.target.value))}
                />
              </div>

              {formData.recurrence?.type === 'weekly' && (
                <div>
                  <Label>Repeat on</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weekDays.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={isWeekDaySelected(day.value)}
                          onCheckedChange={(checked) => 
                            handleWeekDayToggle(day.value, checked as boolean)
                          }
                        />
                        <Label htmlFor={`day-${day.value}`} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="endDate">End recurrence (optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.recurrence?.endDate || ''}
                  onChange={(e) => handleRecurrenceChange('endDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endAfterOccurrences">Or end after occurrences (optional)</Label>
                <Input
                  id="endAfterOccurrences"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.recurrence?.endAfterOccurrences || ''}
                  onChange={(e) => handleRecurrenceChange('endAfterOccurrences', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g., 10"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button type="submit">
              {event ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
