/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AdfToolbarComponent } from './src/components/toolbar/toolbar.component';
import { MaterialModule } from './src/material.module';
import { AppConfigModule } from './src/services/app-config.service';

import {
    AlfrescoApiService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    AlfrescoTranslateLoader,
    AlfrescoTranslationService,
    AppConfigService,
    AuthGuard,
    AuthGuardBpm,
    AuthGuardEcm,
    ContentService,
    CookieService,
    InitAppConfigServiceProvider,
    LogService,
    LogServiceMock,
    NotificationService,
    RenditionsService, StorageService
} from './src/services/index';

import { COLLAPSABLE_DIRECTIVES } from './src/components/collapsable/index';
import { CONTEXT_MENU_DIRECTIVES, CONTEXT_MENU_PROVIDERS } from './src/components/context-menu/index';
import { DataColumnListComponent } from './src/components/data-column/data-column-list.component';
import { DataColumnComponent } from './src/components/data-column/data-column.component';
import { MATERIAL_DESIGN_DIRECTIVES } from './src/components/material/index';
import { VIEW_DIRECTIVES } from './src/components/view/index';
import { UploadDirective } from './src/directives/upload.directive';
import { FileSizePipe } from './src/pipes/file-size.pipe';

export * from './src/services/index';
export * from './src/components/index';
export * from './src/components/data-column/data-column.component';
export * from './src/components/data-column/data-column-list.component';
export * from './src/components/collapsable/index';
export * from './src/components/view/index';
export * from './src/directives/upload.directive';
export * from './src/utils/index';
export * from './src/events/base.event';
export * from './src/events/base-ui.event';
export * from './src/events/folder-created.event';

export * from './src/models/index';

export const ALFRESCO_CORE_PROVIDERS: any[] = [
    NotificationService,
    LogService,
    LogServiceMock,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    StorageService,
    CookieService,
    AlfrescoApiService,
    AlfrescoTranslateLoader,
    AlfrescoTranslationService,
    RenditionsService,
    ContentService,
    AuthGuard,
    AuthGuardEcm,
    AuthGuardBpm,
    ...CONTEXT_MENU_PROVIDERS
];

export function createTranslateLoader(http: Http, logService: LogService): AlfrescoTranslateLoader {
    return new AlfrescoTranslateLoader(http, logService);
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http, LogService]
            }
        }),
        MaterialModule,
        AppConfigModule
    ],
    declarations: [
        ...MATERIAL_DESIGN_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES,
        ...COLLAPSABLE_DIRECTIVES,
        ...VIEW_DIRECTIVES,
        UploadDirective,
        DataColumnComponent,
        DataColumnListComponent,
        FileSizePipe,
        AdfToolbarComponent
    ],
    providers: [
        ...ALFRESCO_CORE_PROVIDERS
    ],
    exports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        TranslateModule,
        MaterialModule,
        ...MATERIAL_DESIGN_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES,
        ...COLLAPSABLE_DIRECTIVES,
        ...VIEW_DIRECTIVES,
        UploadDirective,
        DataColumnComponent,
        DataColumnListComponent,
        FileSizePipe,
        AdfToolbarComponent
    ]
})
export class CoreModule {
    public static forRoot(opts: any = {}): ModuleWithProviders {

        const appConfigFile = opts.appConfigFile || 'app.config.json';

        return {
            ngModule: CoreModule,
            providers: [
                ...ALFRESCO_CORE_PROVIDERS,
                AppConfigService,
                InitAppConfigServiceProvider(appConfigFile)
            ]
        };
    }
}
