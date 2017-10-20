import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTableModule, SharedModule, PanelModule, InputTextModule, CalendarModule, AutoCompleteModule, DialogModule } from 'primeng/primeng';

import { PurchaseInvoice } from './purchaseInvoice.component';
import { PurchaseInvoiceTable } from './components/purchaseInvoiceTable/purchaseInvoiceTable.component';
import { PurchaseInvoiceForm } from './components/purchaseInvoiceForm/purchaseInvoiceForm.component';

import { routing } from './purchaseInvoice.routing';
import { PurchaseInvoiceService } from "./purchaseInvoice.service";
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
    PurchaseInvoice,
    PurchaseInvoiceTable,
    PurchaseInvoiceForm
  ],
  providers: [
    PurchaseInvoiceService,
    ItemService
  ]
})
export class PurchaseInvoiceModule { }
