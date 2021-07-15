import { Injectable } from '@angular/core';
import { environment } from "./environments/environment"

import { Ditto, Identity, Logger, TransportConfig, init } from '@dittolive/ditto';
import websocketURLs from './environments/websocketURLs';

@Injectable()
export class DittoService {
  
  public ditto!: Ditto;

  async loadDitto() {
    let siteID: number = Math.floor(Math.random() * 1000000) + 1;
    const identity: Identity = {
      environment: 'development',
      appName: 'live.ditto.angular-example',
      siteID: BigInt(siteID),
    };
    const path = `live.ditto.angular-example.${siteID}`;
    // call this to initialize ditto. 
    await init()
    const logger = Logger.shared();
    logger.enabled = true;
    logger.minimumLogLevel = 'Debug';
    this.ditto = new Ditto(identity, path);
    this.ditto.setLicenseToken(environment.licenseToken);
    const transportConfig = new TransportConfig();
    transportConfig.connect.websocketURLs = websocketURLs
    this.ditto.setTransportConfig(transportConfig);
    this.ditto.startSync()
  }
}
