import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddcalendarPage } from './addcalendar';

@NgModule({
  declarations: [
    AddcalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(AddcalendarPage),
  ],
})
export class AddcalendarPageModule {}
