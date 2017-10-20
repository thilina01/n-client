import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTableModule, SharedModule, PanelModule, InputTextModule, CalendarModule, AutoCompleteModule } from 'primeng/primeng';

import { Stock } from './stock.component';
import { StockTable } from './components/stockTable/stockTable.component';
import { StockForm } from './components/stockForm/stockForm.component';

import { routing } from './stock.routing';
import { StockService } from './stock.service';
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
    AutoCompleteModule,    
    CalendarModule,
    routing
  ],
  declarations: [
    Stock,
    StockTable,
    StockForm
  ],
  providers: [
    StockService,
    ItemService
  ]
})
export class StockModule { }
