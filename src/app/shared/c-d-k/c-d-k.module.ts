import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    OverlayModule
  ]
})
export class CDKModule { }
