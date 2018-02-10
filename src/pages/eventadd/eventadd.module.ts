import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventaddPage } from './eventadd';

@NgModule({
  declarations: [
    EventaddPage,
  ],
  imports: [
    IonicPageModule.forChild(EventaddPage),
  ],
})
export class EventaddPageModule {}
