import { Pipe, PipeTransform } from '@angular/core';
import { DateUtilsService } from './date-utils.service';

@Pipe({
    name: 'localDate',
    standalone: false
})
export class LocalDatePipe implements PipeTransform {
  constructor(private dateUtils: DateUtilsService) {}

  transform(value: Date | string | null | undefined, format: 'date' | 'datetime' = 'date'): string {
    if (!value) {
      return '';
    }

    try {
      if (format === 'datetime') {
        return this.dateUtils.formatDateTime(value);
      }
      return this.dateUtils.formatDate(value);
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(value);
    }
  }
}
