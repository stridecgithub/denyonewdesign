import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerProgress } from './timerprogress';

@NgModule({
  declarations: [
    TimerProgress,
  ],
  imports: [
    IonicPageModule.forChild(TimerProgress),
  ],
})
export class TimerprogressPageModule {}
