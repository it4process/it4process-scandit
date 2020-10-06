import { Injectable } from '@angular/core';
import { Platform, AlertController, ModalController } from '@ionic/angular';
import { BarcodeScannerPage } from 'src/app/barcode-scanner/barcode-scanner.page';

declare const Scandit;

const getRandomId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);

@Injectable( {
    providedIn: 'root'
} )
export class ScanditBarcodeScannerService {
    camera;

    defaultSymbologies;

    scanditLicenseKey: string;

    private _ready: Promise<void>;

    constructor(protected alertCtrl: AlertController, 
                private modalCtrl: ModalController,
                platform: Platform) {
        this._ready = platform.ready().then(async() => {
            if (!await this.isUsable()) return;

            const cameraSettings = Scandit.BarcodeCapture.recommendedCameraSettings;
            
            this.camera = Scandit.Camera.default;
            this.camera.applySettings(cameraSettings);

            this.defaultSymbologies = [   
                Scandit.Symbology.QR, 
                Scandit.Symbology.GS1Databar, 
                Scandit.Symbology.Code128, 
                Scandit.Symbology.Code39, 
                Scandit.Symbology.InterleavedTwoOfFive, 
                Scandit.Symbology.DataMatrix
            ];

            this.scanditLicenseKey = "PLACE_LICENSE_HERE";
        });
    }

    ready() {
        return this._ready;
    }

    /**
     * Whether the scanner can be used
     */
    public async isUsable(): Promise<boolean> {
        // @ts-ignore | The scanner is only usable in a cordova environment
        return !!(window.cordova && !!Scandit);
    }

    /**
    * Opens scanner
    */
   public async openScanner(): Promise<any> {
        await this.ensureScannerIsUsable();
       
        const context = this.createCameraDataCaptureContext();
        const { frame } = await this.createModal();

        const view = Scandit.DataCaptureView.forContext(context);
        view.connectToElement(frame);

        view.scanAreaMargins = new Scandit.MarginsWithUnit(
            new Scandit.NumberWithUnit(0.15, Scandit.MeasureUnit.Fraction),
            new Scandit.NumberWithUnit(0.15, Scandit.MeasureUnit.Fraction),
            new Scandit.NumberWithUnit(0.15, Scandit.MeasureUnit.Fraction),
            new Scandit.NumberWithUnit(0.15, Scandit.MeasureUnit.Fraction)
        );
        
        const { barcodeTracking } = this.createBarcodeTrackingWithView({ context, frame });
        
        const basicOverlay = Scandit.BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(barcodeTracking, view);

        basicOverlay.shouldShowScanAreaGuides = true;
        basicOverlay.brush = null;
    }

    private async ensureScannerIsUsable() {
        if (!(await this.isUsable())) {
            throw 'SCANNER_NOT_USABLE';
        }
    }

    private async createModal(): Promise<{ modal: HTMLIonModalElement, frame: HTMLElement, componentRef: BarcodeScannerPage }> {
        const frameId = getRandomId();

        let componentRef;

        let modal = await this.modalCtrl.create({ component: BarcodeScannerPage, componentProps: { frameId: frameId, onComponentRef: (ref) => { componentRef = ref } } });

        await modal.present();

        let frame = document.getElementById(frameId);

        return { modal, frame, componentRef };
    }

    private createCameraDataCaptureContext() {
        const context = Scandit.DataCaptureContext.forLicenseKey(this.scanditLicenseKey);
        context.setFrameSource(this.camera);
        return context;
    }

    private createBarcodeTrackingWithView(options: { context, frame: HTMLElement, symbologies?: any[] }) {
        const settings = new Scandit.BarcodeTrackingSettings();

        const barcodeTracking = Scandit.BarcodeTracking.forContext(options.context, settings);

        this.camera.switchToDesiredState(Scandit.FrameSourceState.On);

        return { barcodeTracking };
    }
}