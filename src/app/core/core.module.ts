import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';
import { CookieLawModule } from 'angular2-cookie-law';

import { TrackingModule } from '../extensions/tracking/tracking.module';

import { ConfigurationModule } from './configuration.module';
import { IconModule } from './icon.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';
import { StateManagementModule } from './state-management.module';

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  imports: [
    ConfigurationModule,
    CookieLawModule,
    HttpClientModule,
    ReactiveComponentLoaderModule.forRoot(),
    RouterModule,
    StateManagementModule,
    TrackingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
  ],
  // exports needed to use the CookieLaw module in the AppComponent
  exports: [CookieLawModule, TranslateModule],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    popoverConfig: NgbPopoverConfig
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }

    popoverConfig.placement = 'top';
    popoverConfig.triggers = 'hover';
    popoverConfig.container = 'body';

    IconModule.init();
  }
}