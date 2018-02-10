import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventeditPage } from './eventedit';

@NgModule({
  declarations: [
    EventeditPage,
  ],
  imports: [
    IonicPageModule.forChild(EventeditPage),
  ],
})
export class EventeditPageModule {}
