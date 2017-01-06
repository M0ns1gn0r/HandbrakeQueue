import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FileDropDirective } from './file-drop';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule, ],
  declarations: [ AppComponent, FileDropDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
