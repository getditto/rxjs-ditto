import { Injectable } from '@angular/core';
import { environment } from "./environments/environment"

import { Ditto, Identity, Logger, TransportConfig } from '@dittolive/ditto';
import RxDitto from '@dittolive/rxjs-ditto';
import websocketURLs from './environments/websocketURLs';

@Injectable()
export class DittoService {
  
  public rxDitto!: RxDitto;

  async loadDitto() {
    let siteID: number = Math.floor(Math.random() * 1000000) + 1;

    const identity: Identity = {
      environment: 'development',
      appName: 'live.ditto.angular-example',
      siteID: BigInt(siteID),
    };

    const path = `live.ditto.angular-example.${siteID}`;
    const logger = await Logger.shared();
    logger.enabled = true;
    logger.minimumLogLevel = 'Debug';
    const ditto = await new Ditto(identity, path);
    ditto.setAccessLicense(environment.licenseToken);
    const transportConfig = new TransportConfig();
    transportConfig.connect.websocketURLs = websocketURLs
    ditto.setTransportConfig(transportConfig);
    this.rxDitto = new RxDitto(ditto);
  }
}
