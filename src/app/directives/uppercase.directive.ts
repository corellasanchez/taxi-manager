import { Directive, EventEmitter, HostListener, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  private regex: RegExp = this.regex = new RegExp(/^[a-zA-Z0-9]*$/);

  private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) { }

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.toUpperCase();
    this.ngModelChange.emit(this.value);
  }


  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
