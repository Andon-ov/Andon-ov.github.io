import { Pipe, PipeTransform } from '@angular/core';

/**
 * TimestampFormatPipe is a custom Angular pipe used for formatting timestamps.
 * It transforms a timestamp represented as a string into a human-readable date and time string.
 */
@Pipe({
  name: 'timestampFormat',
})
export class TimestampFormatPipe implements PipeTransform {
  /**
   * Transform a timestamp string into a human-readable date and time string.
   * @param timestamp The timestamp string to be formatted
   * @returns A human-readable date and time string representing the provided timestamp
   */
  transform(timestamp: string): string {
    // Convert the timestamp string to a JavaScript Date object
    const date = new Date(parseInt(timestamp, 10));

    // Format the Date object into a human-readable string using the local date and time format
    return date.toLocaleString();
  }
}
