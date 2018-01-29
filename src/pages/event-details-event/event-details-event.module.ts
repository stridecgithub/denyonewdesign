import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsEventPage } from './event-details-event';

@NgModule({
  declarations: [
    EventDetailsEventPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailsEventPage),
  ],
})
export class EventDetailsEventPageModule {}
