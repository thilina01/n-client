import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTableModule, SharedModule, PanelModule, InputTextModule, CalendarModule, AutoCompleteModule, DialogModule } from 'primeng/primeng';

import { SalesInvoice } from './salesInvoice.component';
import { SalesInvoiceTable } from './components/salesInvoiceTable/salesInvoiceTable.component';
import { SalesInvoiceForm } from './components/salesInvoiceForm/salesInvoiceForm.component';

import { routing } from './salesInvoice.routing';
import { SalesInvoiceService } from "./salesInvoice.service";
import { ItemService } from '../item/item.service';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    SharedModule,
    PanelModule,
    InputTextModule,
    CalendarModule,
    DialogModule,
    AutoCompleteModule,
    routing
  ],
  declarations: [
    SalesInvoice,
    SalesInvoiceTable,
    SalesInvoiceForm
  ],
  providers: [
    SalesInvoiceService,
    ItemService
  ]
})
export class SalesInvoiceModule { }
