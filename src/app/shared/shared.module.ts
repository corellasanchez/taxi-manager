import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NumberDirective } from '../directives/number.directive';
import { UppercaseDirective } from '../directives/uppercase.directive';
import localeEsCR from '@angular/common/locales/es-CR';

registerLocaleData(localeEsCR, 'es-CR');

@NgModule({
  declarations: [NumberDirective, UppercaseDirective],
  providers: [ { provide: LOCALE_ID, useValue: 'es-CR' } ],
  imports: [
  ],
  exports: [
    NumberDirective,
    UppercaseDirective
  ]
})
export class SharedModule { }
