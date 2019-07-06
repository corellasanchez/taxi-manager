import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { UppercaseDirective } from '../directives/uppercase.directive';
import localeEsCR from '@angular/common/locales/es-CR';

registerLocaleData(localeEsCR, 'es-CR');

@NgModule({
  declarations: [UppercaseDirective],
  providers: [ { provide: LOCALE_ID, useValue: 'es-CR' } ],
  imports: [
  ],
  exports: [
    UppercaseDirective
  ]
})
export class SharedModule { }
