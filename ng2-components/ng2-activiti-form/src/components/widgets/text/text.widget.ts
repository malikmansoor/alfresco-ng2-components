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

/* tslint:disable:component-selector  */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormFieldModel } from '../core/form-field.model';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'text-widget',
    templateUrl: './text.widget.html',
    styleUrls: ['./text.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class TextWidgetComponent extends WidgetComponent implements OnInit {

    mask: string;
    isMaskReversed: boolean;

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field.params && this.field.params['inputMask']) {
            this.mask = this.field.params['inputMask'];
            this.isMaskReversed = this.field.params['inputMaskReversed'] ? this.field.params['inputMaskReversed'] : false;
        }
    }
}
