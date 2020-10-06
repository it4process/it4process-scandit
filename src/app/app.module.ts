import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BarcodeScannerPage } from './barcode-scanner/barcode-scanner.page';
import { ScanditBarcodeScannerService } from './services/scandit/scandit-barcode-scanner.service';

@NgModule({
  declarations: [
    AppComponent,
    BarcodeScannerPage
  ],
  entryComponents: [
    BarcodeScannerPage
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScanditBarcodeScannerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
