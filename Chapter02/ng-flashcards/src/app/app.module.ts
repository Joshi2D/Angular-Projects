import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlashComponent } from './flash/flash.component';
import { FlashService } from './flash.service';
import { ScoreComponent } from './score/score.component';
import {HttpClientModule} from '@angular/common/http'
import { WebAdminService } from './webAdmin.service';
import { CountryService } from './country.service';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, NgMultiSelectDropDownModule.forRoot()],
  declarations: [ AppComponent, FlashComponent, ScoreComponent ],
  bootstrap:    [ AppComponent],
  providers: [FlashService, WebAdminService, CountryService]
  
})
export class AppModule { }
