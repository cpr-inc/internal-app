import { Pipe, PipeTransform } from '@angular/core';
import * as ja from 'date-fns/locale/ja';
import { format } from 'date-fns'

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(date: string): string {
    return format(date, 'YYYY年MMMDo H:mm', { locale: ja });
  }
}