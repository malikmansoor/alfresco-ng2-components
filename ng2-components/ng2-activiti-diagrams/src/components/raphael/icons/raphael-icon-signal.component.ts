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

import { Directive, ElementRef, OnInit } from '@angular/core';
import { Point } from './../models/point';
import { RaphaelBase } from './../raphael-base';
import { RaphaelService } from './../raphael.service';

@Directive({selector: 'raphael-icon-signal'})
export class RaphaelIconSignalDirective extends RaphaelBase implements OnInit {

    constructor(public elementRef: ElementRef,
                raphaelService: RaphaelService) {
        super(elementRef, raphaelService);
    }

    public ngOnInit(): void {

        this.draw(this.position);
    }

    public draw(position: Point): void {
        let path1 = this.paper.path(`M 8.7124971,21.247342 L 23.333334,21.247342 L 16.022915,8.5759512 L 8.7124971,21.247342 z`).attr({
            opacity: this.fillOpacity,
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            fill: this.fillColors
        });
        return path1.transform('T' + position.x + ',' + position.y);
    }
}
