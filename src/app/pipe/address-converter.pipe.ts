import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressConverter',
})
export class AddressConverterPipe implements PipeTransform {
  transform(value: String, ...args: unknown[]): unknown {
    let strLength = value.length;
    let start = value.slice(0, 6);
    let end = value.slice(strLength - 4, strLength);
    return `${start}....${end}`;
  }
}
