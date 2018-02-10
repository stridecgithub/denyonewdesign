import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventviewPage } from './eventview';

@NgModule({
  declarations: [
    EventviewPage,
  ],
  imports: [
    IonicPageModule.forChild(EventviewPage),
  ],
})
export class EventviewPageModule {}
