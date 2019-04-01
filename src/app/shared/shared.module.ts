import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective } from '../directives/number.directive';
import { UppercaseDirective } from '../directives/uppercase.directive';



@NgModule({
  declarations: [NumberDirective, UppercaseDirective],
  imports: [
  ],
  exports: [
    NumberDirective,
    UppercaseDirective
  ]
})
export class SharedModule { }
