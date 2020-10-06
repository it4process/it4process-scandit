import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component( {
    selector: 'app-barcode-scanner',
    templateUrl: './barcode-scanner.page.html',
    styleUrls: ['./barcode-scanner.page.scss']
})
export class BarcodeScannerPage {
    @Input() frameId: string;
    @Input() windowTitle: string;
    @Input() onComponentRef: (ref) => any;
    public showDoneButton: boolean;
    public doneButtonPromiseHandler: { resolve: any, reject: any };

    public currentConfirmationViewPromiseHandler: { resolve: any, reject: any };
    
    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        if (this.onComponentRef) {
            this.onComponentRef(this);
        }
    }

    close() {
        return this.modalCtrl.dismiss();
    }
}