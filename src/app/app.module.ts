import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CDKModule } from './shared/c-d-k/c-d-k.module';
import { VaultComponent } from './vault/vault.component';
import { HelpModalComponent } from './help-modal/help-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HelpModalComponent,
    VaultComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CDKModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    HelpModalComponent
  ]
})
export class AppModule { }
