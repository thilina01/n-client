import { Routes, RouterModule }  from '@angular/router';

import { SalesInvoice } from './salesInvoice.component';
import { SalesInvoiceForm } from './components/salesInvoiceForm/salesInvoiceForm.component';
import { SalesInvoiceTable } from './components/salesInvoiceTable/salesInvoiceTable.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: SalesInvoice,
     children: [
      { path: 'form', component: SalesInvoiceForm },
      { path: 'form/:id', component: SalesInvoiceForm },
      { path: 'table', component: SalesInvoiceTable }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
