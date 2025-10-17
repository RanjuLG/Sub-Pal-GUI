import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  /**
   * Converts a Date object to local ISO string (YYYY-MM-DDTHH:mm:ss)
   * This ensures the date is sent in local time, not UTC
   */
  toLocalISOString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  /**
   * Converts a Date object to local date string (YYYY-MM-DD)
   * Useful for date-only fields
   */
  toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Parses a date string or Date object and returns a Date object
   * Ensures consistent handling of date inputs
   */
  parseDate(dateInput: Date | string): Date {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    
    // If the string doesn't contain time info, it will be treated as local date
    return new Date(dateInput);
  }

  /**
   * Formats a date for display (locale-aware)
   */
  formatDate(dateInput: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const date = this.parseDate(dateInput);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return date.toLocaleDateString(undefined, defaultOptions);
  }

  /**
   * Formats a date with time for display (locale-aware)
   */
  formatDateTime(dateInput: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const date = this.parseDate(dateInput);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return date.toLocaleString(undefined, defaultOptions);
  }

  /**
   * Gets the timezone offset in hours
   */
  getTimezoneOffset(): number {
    return -new Date().getTimezoneOffset() / 60;
  }

  /**
   * Gets the timezone name
   */
  getTimezoneName(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}
