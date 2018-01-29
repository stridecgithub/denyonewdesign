import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicingDetailsPage } from './servicing-details';

@NgModule({
  declarations: [
    ServicingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicingDetailsPage),
  ],
})
export class ServicingDetailsPageModule {}
