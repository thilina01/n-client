import { Routes, RouterModule } from '@angular/router';

import { Stock } from './stock.component';
import { StockForm } from './components/stockForm/stockForm.component';
import { StockTable } from './components/stockTable/stockTable.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: Stock,
    children: [
      { path: 'form', component: StockForm },
      { path: 'form/:id', component: StockForm },
      { path: 'table', component: StockTable }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
