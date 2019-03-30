import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective } from '../directives/number.directive';


@NgModule({
  declarations: [NumberDirective],
  imports: [
  ],
  exports: [
    NumberDirective
  ]
})
export class SharedModule { }
