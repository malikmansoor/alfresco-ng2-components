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

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { WidgetComponent } from './../widget.component';

function dateCheck(abstractControl: AbstractControl): any {
    let startDate = moment(abstractControl.get('startDate').value);
    let endDate = moment(abstractControl.get('endDate').value);
    let result = startDate.isAfter(endDate);
    return result ? {greaterThan: true} : null;
}

declare let mdDateTimePicker: any;

@Component({
    selector: 'date-range-widget',
    templateUrl: './date-range.widget.html',
    styleUrls: ['./date-range.widget.css']
})
export class DateRangeWidget extends WidgetComponent {

    public static FORMAT_DATE_ACTIVITI: string = 'YYYY-MM-DD';

    @ViewChild('startElement')
    public startElement: any;

    @ViewChild('endElement')
    public endElement: any;

    @Input('group')
    public dateRange: FormGroup;

    @Input()
    public field: any;

    @Output()
    public dateRangeChanged: EventEmitter<any> = new EventEmitter<any>();

    public debug: boolean = false;

    public dialogStart: any;

    public dialogEnd: any;

    constructor(public elementRef: ElementRef,
                private formBuilder: FormBuilder) {
        super();
    }

    public  ngOnInit(): void {
        this.initForm();
        this.addAccessibilityLabelToDatePicker();
    }

    public initForm(): void {
        let startDateForm = this.field.value ? this.field.value.startDate : '';
        let startDate = this.convertToMomentDate(startDateForm);
        let endDateForm = this.field.value ? this.field.value.endDate : '';
        let endDate = this.convertToMomentDate(endDateForm);

        let startDateControl = new FormControl(startDate);
        startDateControl.setValidators(Validators.required);
        this.dateRange.addControl('startDate', startDateControl);

        let endDateControl = new FormControl(endDate);
        endDateControl.setValidators(Validators.required);
        this.dateRange.addControl('endDate', endDateControl);

        this.dateRange.setValidators(dateCheck);
        this.dateRange.valueChanges.subscribe((data) => this.onGroupValueChanged(data));

        this.initStartDateDialog(startDate);
        this.initEndDateDialog(endDate);
    }

    private initStartDateDialog(date: string): void {
        let settings: any = {
            type: 'date',
            past: moment().subtract(100, 'years'),
            future: moment().add(100, 'years')
        };

        settings.init = moment(date, DateRangeWidget.FORMAT_DATE_ACTIVITI);

        this.dialogStart = new mdDateTimePicker.default(settings);
        this.dialogStart.trigger = this.startElement.nativeElement;

        let startDateButton = document.getElementById('startDateButton');
        startDateButton.addEventListener('click', () => {
            this.dialogStart.toggle();
        });
    }

    private addAccessibilityLabelToDatePicker(): void {
        let left: any = document.querySelector('#mddtp-date__left');
        if (left) {
            left.appendChild(this.createCustomElement('date left'));
        }

        let right: any = document.querySelector('#mddtp-date__right');
        if (right) {
            right.appendChild(this.createCustomElement('date right'));
        }

        let cancel: any = document.querySelector('#mddtp-date__cancel');
        if (cancel) {
            cancel.appendChild(this.createCustomElement('date cancel'));
        }

        let ok: any = document.querySelector('#mddtp-date__ok');
        if (ok) {
            ok.appendChild(this.createCustomElement('date ok'));
        }
    }

    private createCustomElement(text: string): HTMLElement {
        let span = document.createElement('span');
        span.style.visibility = 'hidden';
        let rightSpanText = document.createTextNode(text);
        span.appendChild(rightSpanText);
        return span;
    }

    public initEndDateDialog(date: string): void {
        let settings: any = {
            type: 'date',
            past: moment().subtract(100, 'years'),
            future: moment().add(100, 'years')
        };

        settings.init = moment(date, DateRangeWidget.FORMAT_DATE_ACTIVITI);

        this.dialogEnd = new mdDateTimePicker.default(settings);
        this.dialogEnd.trigger = this.endElement.nativeElement;

        let endDateButton = document.getElementById('endDateButton');
        endDateButton.addEventListener('click', () => {
            this.dialogEnd.toggle();
        });
    }

    public onOkStart(inputEl: HTMLInputElement): void {
        let date = this.dialogStart.time.format(DateRangeWidget.FORMAT_DATE_ACTIVITI);
        this.dateRange.patchValue({
            startDate: date
        });
        let materialElemen: any = inputEl.parentElement;
        if (materialElemen) {
            materialElemen.MaterialTextfield.change(date);
        }
    }

    public onOkEnd(inputEl: HTMLInputElement): void {
        let date = this.dialogEnd.time.format(DateRangeWidget.FORMAT_DATE_ACTIVITI);
        this.dateRange.patchValue({
            endDate: date
        });

        let materialElemen: any = inputEl.parentElement;
        if (materialElemen) {
            materialElemen.MaterialTextfield.change(date);
        }
    }

    public onGroupValueChanged(data: any): void {
        if (this.dateRange.valid) {
            let dateStart = this.convertToMomentDateWithTime(this.dateRange.controls.startDate.value);
            let endStart = this.convertToMomentDateWithTime(this.dateRange.controls.endDate.value);
            this.dateRangeChanged.emit({startDate: dateStart, endDate: endStart});
        }
    }

    public convertToMomentDateWithTime(date: string): any {
        return moment(date, DateRangeWidget.FORMAT_DATE_ACTIVITI, true).format(DateRangeWidget.FORMAT_DATE_ACTIVITI) + 'T00:00:00.000Z';
    }

    private convertToMomentDate(date: string): any {
        if (date) {
            return moment(date).format(DateRangeWidget.FORMAT_DATE_ACTIVITI);
        } else {
            return moment().format(DateRangeWidget.FORMAT_DATE_ACTIVITI);
        }
    }
}
