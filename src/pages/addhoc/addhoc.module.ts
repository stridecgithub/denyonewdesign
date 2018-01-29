import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddhocPage } from './addhoc';

@NgModule({
  declarations: [
    AddhocPage,
  ],
  imports: [
    IonicPageModule.forChild(AddhocPage),
  ],
})
export class AddhocPageModule {}
