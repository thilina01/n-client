
import { SharedService } from '../../../../services/shared.service';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ConfirmationService, Message } from 'primeng/primeng';
import { Router } from '@angular/router';
import { PurchaseInvoiceService } from "../../purchaseInvoice.service";
import { DataTable } from 'primeng/components/datatable/datatable';

@Component({
  selector: 'purchase-invoice-table',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./purchaseInvoiceTable.scss'],
  templateUrl: './purchaseInvoiceTable.html',
})

export class PurchaseInvoiceTable {
  @ViewChild(DataTable) dataTable: DataTable;
  rows = [];
  timeout: any;
  totalRecords: number;
  startDate: Date;
  endDate: Date;

  columns = [
    { prop: 'id', name: 'ID' },
    { prop: 'amount', name: 'Amount' },
  ];

  constructor(protected service: PurchaseInvoiceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sharedService: SharedService) {
    this.loadData()
  }
  search(first: number, pageSize: number): void {
    if (this.startDate != undefined && this.endDate != undefined) {
      this.service.getByInvoiceDatePage(this.sharedService.YYYYMMDD(this.startDate), this.sharedService.YYYYMMDD(this.endDate), first, pageSize).subscribe((data: any) => {
        this.fillTable(data);
      });
    } else {
      this.service.getPage(first, pageSize).subscribe((data: any) => {
        this.fillTable(data);
      });
    }
  }

  loadData() {
    this.service.getPage(0, 20).subscribe((data: any) => {
      this.rows = data.content;
      this.totalRecords = data.totalElements;

    });
  }

  fillTable(data: any) {
    this.rows = data.content;
    this.totalRecords = data.totalElements;
  }

  lazy(event: any, table: any) {
    console.log(event);
    this.search((event.first / event.rows), event.rows);
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  onRowDblclick(data: any): void {
    this.router.navigate(['/pages/purchaseInvoice/form/' + data.id]);
  }

  navigateToForm(id: any): void {
    this.router.navigate(['/pages/purchaseInvoice/form/' + id]);
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete?',
      accept: () => {
        this.service.delete(id).subscribe(response => {
          this.sharedService.addMessage({ severity: 'info', summary: 'Deleted', detail: 'Delete success' });
          this.loadData()
        }
        );
      }
    });
  }
}
