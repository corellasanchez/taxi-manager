import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[appNumberOnly]'
})
export class NumberDirective implements OnChanges {
    private regex: RegExp = this.regex = new RegExp(/^[0-9]+([0-9]*){0,1}$/g);

    @Input() public number: any;
    @Input() public input: any;

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) ngOnChanges(event: any) {
        const current: string = this.el.nativeElement.value;
        if (current && !String(current).match(this.regex)) {
            this.el.nativeElement.value = this.el.nativeElement.value.replace(/\D/g, '');
            event.preventDefault();
        }
    }
}
