import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlarmdetailsPage } from './alarmdetails';

@NgModule({
  declarations: [
    AlarmdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AlarmdetailsPage),
  ],
})
export class AlarmdetailsPageModule {}
