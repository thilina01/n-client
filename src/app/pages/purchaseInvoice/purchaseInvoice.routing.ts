import { Routes, RouterModule }  from '@angular/router';

import { PurchaseInvoice } from './purchaseInvoice.component';
import { PurchaseInvoiceForm } from './components/purchaseInvoiceForm/purchaseInvoiceForm.component';
import { PurchaseInvoiceTable } from './components/purchaseInvoiceTable/purchaseInvoiceTable.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PurchaseInvoice,
     children: [
      { path: 'form', component: PurchaseInvoiceForm },
      { path: 'form/:id', component: PurchaseInvoiceForm },
      { path: 'table', component: PurchaseInvoiceTable }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
