import { Component } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { BaMenuService } from '../theme';
import { MENU } from '../app.menu';
import { Message } from 'primeng/primeng';
import { SharedService } from '../services/shared.service';
import { MenuService } from '../services/menu.service';
import { UserMenuService } from '../services/userMenu.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { OrganizationService } from './organization/organization.service';

@Component({
  selector: 'pages',
  styleUrls: ['./pages.scss'],
  templateUrl: './pages.html',
  providers: [SharedService]
})
export class Pages {
  organization: any;
  msgs: Message[] = [];
  logoPath = '/assets/img/logo.png';
  constructor(private _menuService: BaMenuService,
    private sharedService: SharedService,
    private menuService: MenuService,
    private userMenuService: UserMenuService,
    private organizationService: OrganizationService,
    private router: Router) {

    sharedService.messageSubject.subscribe(
      message => {
        this.msgs.push(message);
      });
      this.getOrganization();
  }

  getOrganization() {
    this.organizationService.getAll().subscribe((data: any) => {
      this.organization = data[0];
    });
  }

  ngOnInit() {
    this.main = document.getElementById('main');
    this.footer = document.getElementById('footer');
    this.mySidebar = document.getElementById('mySidebar');
    this.menuService.saveMany(this.menuList);
    this.menuList = [];

    this.userMenuService.getOwn().then((data: any) => {
      data.forEach(userMenu => {
        this.menuList.push(userMenu.menu)
      });
    });
  }
  menuType = { code: 'ng', name: 'Angular' };

  menuList = [
    { routerLink: '/login', name: 'Logout', menuType: this.menuType },
    { routerLink: '/pages/application/table', name: 'Application', menuType: this.menuType },
    { routerLink: '/pages/country/table', name: 'Country', menuType: this.menuType },
    { routerLink: '/pages/employee/table', name: 'Employee', menuType: this.menuType },
    { routerLink: '/pages/home', name: 'Home', menuType: this.menuType },
    { routerLink: '/pages/item/table', name: 'Item', menuType: this.menuType },
    { routerLink: '/pages/itemType/table', name: 'Item Type', menuType: this.menuType },
    { routerLink: '/pages/mailConfiguration/table', name: 'Mail Configuration ', menuType: this.menuType },
    { routerLink: '/pages/organization/table', name: 'Organization', menuType: this.menuType },
    { routerLink: '/pages/permission/form', name: 'Permission', menuType: this.menuType },
    { routerLink: '/pages/purchaseInvoice/table', name: 'Purchase Invoice', menuType: this.menuType },
    { routerLink: '/pages/salesInvoice/table', name: 'Sales Invoice', menuType: this.menuType },
    { routerLink: '/pages/stock/table', name: 'Stock', menuType: this.menuType },
    { routerLink: '/pages/team/table', name: 'Team', menuType: this.menuType },
  ];
  main;
  footer;
  mySidebar;
  openNav;

  ngAfterViewInit() {
    console.log(this.sharedService);
  }
  w3_toggle() {
    if (document.getElementById('mySidebar').style.display != 'none') {
      this.w3_close();
    } else {
      this.w3_open();
    }
  }
  w3_open() {
    this.main.style.marginLeft = '200px';
    this.footer.style.marginLeft = '200px';
    this.mySidebar.style.width = '200px';
    this.mySidebar.style.display = 'block';
  }
  w3_close() {
    this.main.style.marginLeft = '0%';
    this.footer.style.marginLeft = '0%';
    this.mySidebar.style.display = 'none';
  }

  filteredMenus: any[];

  filterMenus(event) {
    this.filteredMenus = [];
    for (let i = 0; i < this.menuList.length; i++) {
      let menu = this.menuList[i];
      if (menu.name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredMenus.push(menu);
      }
    }
  }

  handleDropdownClick() {
    this.filteredMenus = [];

    //mimic remote call
    setTimeout(() => {
      this.filteredMenus = this.menuList;
    }, 100)
  }
  menu: any;
  onSelect(menu: any) {
    this.router.navigate([menu.routerLink]);
    console.log(event)
    this.menu = { name: '' }
  }
}
