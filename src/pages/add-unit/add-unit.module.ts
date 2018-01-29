import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUnitPage } from './add-unit';

@NgModule({
  declarations: [
    AddUnitPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUnitPage),
  ],
})
export class AddUnitPageModule {}
