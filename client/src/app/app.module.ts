import { NgModule, isDevMode } from "@angular/core";
import { imports } from "./app-imports.module";
import { providers } from "./app-provides.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports,
  providers,
  bootstrap: [AppComponent],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
})
export class AppModule { }
