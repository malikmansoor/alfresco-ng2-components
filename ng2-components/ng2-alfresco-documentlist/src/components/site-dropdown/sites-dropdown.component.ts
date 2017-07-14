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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { SiteModel } from '../../models/site.model';
import { SitesService } from '../../services/sites.service';

@Component({
    selector: 'adf-sites-dropdown',
    styleUrls: ['./sites-dropdown.component.css'],
    templateUrl: './sites-dropdown.component.html'
})
export class DropdownSitesComponent implements OnInit {

    @Input()
    showDefaultOption: boolean = false;

    @Output()
    siteChanged: EventEmitter<any> = new EventEmitter();

    siteList = [];

    public siteSelected: SiteModel;

    constructor(translateService: AlfrescoTranslationService,
                private sitesService: SitesService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-documentlist', 'assets/ng2-alfresco-documentlist');
        }
    }

    ngOnInit() {
        this.sitesService.getSites().subscribe((result) => {
            this.siteList = result;
        });
    }

    selectedSite() {
        this.siteChanged.emit(this.siteSelected);
    }

}