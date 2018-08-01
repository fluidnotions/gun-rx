import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GunModule } from 'gun-ngrx';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GunModule.forRoot({
      peers: [],
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
