import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '../app';

@NgModule({
  declarations: [],
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }