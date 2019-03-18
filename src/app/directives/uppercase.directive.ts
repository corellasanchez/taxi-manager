import { Directive, EventEmitter, HostListener, Input, ElementRef, OnChanges } from '@angular/core';

@Directive({
    selector: '[appUppercase]'
})
export class UppercaseDirective implements OnChanges {
    private regex: RegExp = this.regex = new RegExp(/^[a-zA-Z0-9]*$/);

    @Input() public number: any;
    @Input() public input: any;

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) ngOnChanges(event: any) {
            this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
            this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^a-zA-Z0-9-]/g, '');
            event.preventDefault();
    }
}
