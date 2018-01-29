import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsServicePage } from './event-details-service';

@NgModule({
  declarations: [
    EventDetailsServicePage,
  ],
  imports: [
    IonicPageModule.forChild(EventDetailsServicePage),
  ],
})
export class EventDetailsServicePageModule {}
