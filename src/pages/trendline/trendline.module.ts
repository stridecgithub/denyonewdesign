import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrendlinePage } from './trendline';

@NgModule({
  declarations: [
    TrendlinePage,
  ],
  imports: [
    IonicPageModule.forChild(TrendlinePage),
  ],
})
export class TrendlinePageModule {}
