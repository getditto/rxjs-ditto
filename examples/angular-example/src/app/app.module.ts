import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DittoService } from 'src/DittoService';
import { AppComponent } from './app.component';

export function appInit(dittoService: DittoService) {
  return async () => {
    await dittoService.loadDitto();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  bootstrap: [AppComponent],
  providers: [
    DittoService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [DittoService],
    },
  ],
})
export class AppModule {}
