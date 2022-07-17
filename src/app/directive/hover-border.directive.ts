import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHoverBorder]'
})
export class HoverBorderDirective {

   constructor(private el: ElementRef) {
       this.el.nativeElement.onmouseover = function() {
        this.style.border = 'grey 1px solid';
      }
      this.el.nativeElement.onmouseout = function() {
        this.style.border = '1px solid rgb(255, 255, 255)';
      }
    }

}
