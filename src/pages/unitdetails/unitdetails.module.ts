import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnitdetailsPage } from './unitdetails';

@NgModule({
  declarations: [
    UnitdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(UnitdetailsPage),
  ],
})
export class UnitdetailsPageModule {}
