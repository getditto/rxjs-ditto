import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Ditto, Identity, Logger, TransportConfig } from '@dittolive/ditto';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

(async () => {
  const platform = platformBrowserDynamic();
  await platform.bootstrapModule(AppModule);
})().catch((err) => console.error(err));

