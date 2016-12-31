import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';

import { FileDropModule } from './angular2-file-drop/file-drop-module';

@NgModule({
  imports:      [ BrowserModule, FileDropModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
