import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsandcommentsPage } from './eventsandcomments';

@NgModule({
  declarations: [
    EventsandcommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsandcommentsPage),
  ],
})
export class EventsandcommentsPageModule {}
