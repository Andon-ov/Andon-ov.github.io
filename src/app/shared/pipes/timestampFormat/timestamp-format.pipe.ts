import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampFormat'
})
export class TimestampFormatPipe implements PipeTransform {
  transform(timestamp: string): string {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString(); 
  }
}