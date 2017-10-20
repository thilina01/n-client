import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from '../services/auth-guard.service';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    canActivate: [AuthGuard],
    children: [
      { path: '', canActivate: [AuthGuard], redirectTo: 'home', pathMatch: 'full' },
      { path: 'application', canActivate: [AuthGuard], loadChildren: 'app/pages/application/application.module#ApplicationModule' },
      { path: 'country', canActivate: [AuthGuard], loadChildren: 'app/pages/country/country.module#CountryModule' },
      { path: 'employee', canActivate: [AuthGuard], loadChildren: 'app/pages/employee/employee.module#EmployeeModule' },
      { path: 'home', canActivate: [AuthGuard], loadChildren: 'app/pages/home/home.module#HomeModule' },
      { path: 'item', canActivate: [AuthGuard], loadChildren: 'app/pages/item/item.module#ItemModule' },
      { path: 'itemType', canActivate: [AuthGuard], loadChildren: 'app/pages/itemType/itemType.module#ItemTypeModule' },
      { path: 'mailConfiguration', canActivate: [AuthGuard], loadChildren: 'app/pages/mailConfiguration/mailConfiguration.module#MailConfigurationModule' },
      { path: 'organization', canActivate: [AuthGuard], loadChildren: 'app/pages/organization/organization.module#OrganizationModule' },
      { path: 'permission', canActivate: [AuthGuard], loadChildren: 'app/pages/permission/permission.module#PermissionModule' },
      { path: 'purchaseInvoice', canActivate: [AuthGuard], loadChildren: 'app/pages/purchaseInvoice/purchaseInvoice.module#PurchaseInvoiceModule' },
      { path: 'salesInvoice', canActivate: [AuthGuard], loadChildren: 'app/pages/salesInvoice/salesInvoice.module#SalesInvoiceModule' },
      { path: 'stock', canActivate: [AuthGuard], loadChildren: 'app/pages/stock/stock.module#StockModule' },
      { path: 'team', canActivate: [AuthGuard], loadChildren: 'app/pages/team/team.module#TeamModule' },
      { path: 'test', canActivate: [AuthGuard], loadChildren: 'app/pages/test/test.module#TestModule' },
      { path: 'user', canActivate: [AuthGuard], loadChildren: 'app/pages/user/user.module#UserModule' },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
