import { Component } from '@angular/core';
import { ScanditBarcodeScannerService } from '../services/scandit/scandit-barcode-scanner.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private scanditBarcodeScannerService: ScanditBarcodeScannerService) {}

  openScanner() {
    return this.scanditBarcodeScannerService.openScanner();
  }
}
