import { Component, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { SharedService } from '../../../../services/shared.service';
import { SalesInvoiceService } from '../../salesInvoice.service';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { ItemService } from '../../../item/item.service';

@Component({
    selector: 'sales-invoice-form',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./salesInvoiceForm.scss'],
    templateUrl: './salesInvoiceForm.html',
})

export class SalesInvoiceForm {
    @Input('formGroup')
    public formGroup: FormGroup;
    @ViewChild(DataTable) dataTable: DataTable;
    public salesInvoiceItemFormGroup: FormGroup;

    JSON: any = JSON;

    public FormGroup: FormGroup;
    salesInvoice: any = {};
    subscription: Subscription;
    item: Array<any>;
    totalRecords = 0;
    salesInvoiceType: any;
    invoiceDate: Date;
    itemList = [];

    constructor(protected service: SalesInvoiceService,
        private route: ActivatedRoute,
        private router: Router,
        fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private itemService: ItemService,
        private sharedService: SharedService) {

        this.formGroup = fb.group({
            id: '',
            quantity: 0,
            amount: 0,
            invoiceDate: [this.invoiceDate, Validators.required],
            salesInvoiceItemList: [[]],
        });

        this.salesInvoiceItemFormGroup = fb.group({
            price: '',
            quantity: '',
            amount: '',
            item: [{}, Validators.compose([Validators.required])],
        });
    }

    getItemList(): void {
        this.itemService.getCombo().subscribe(itemList => this.itemList = itemList);
    }

    refresh(): void {
        this.getItemList();
    }

    fillSalesInvoiceItems(): void {
        this.formGroup.value.salesInvoiceItemList = this.formGroup.value.salesInvoiceItemList.slice();
        this.dataTable.reset();
    }

    onEditComplete() {
        this.calculateTotal();
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.refresh();
        }, 500);
        this.getItemList();
        this.route.params.subscribe(
            (params: Params) => {
                let id = params['id'];
                id = id == undefined ? '0' : id;
                if (id != '0') {
                    this.service.getOne(+id).subscribe(
                        (data) => {
                            this.loadForm(data);
                        }
                    )
                }
            }
        );
    }

    loadForm(data: any) {
        if (data != null) {
            data.invoiceDate = new Date(data.invoiceDate);
            this.salesInvoice = data;
        }
        this.formGroup.patchValue(this.salesInvoice, { onlySelf: true });
        this.salesInvoiceType = this.salesInvoice.salesInvoiceType;
        this.item = this.salesInvoice.item;
        this.setDisplayOfItem();
        this.calculateTotal();
    }

    public onSubmit(values: any, event: Event): void {
        event.preventDefault();
        console.log(values);
        if (values.salesInvoiceItemList === null || values.salesInvoiceItemList.length === 0) {
            alert('Items Required');
            return;
        }
        this.service.save(values).subscribe(
            (data) => {
                this.sharedService.addMessage({ severity: 'info', summary: 'Success', detail: 'Operation Success' });
                this.resetForm();
                this.router.navigate(['/pages/salesInvoice/form/']);
            }
        );
    }

    public resetForm() {
        this.formGroup.reset();
        this.salesInvoiceItemFormGroup.reset();
    }

    public removeSalesInvoiceItem(id: number) {
        if (this.formGroup.value.salesInvoiceItemList != null) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Delete?',
                accept: () => {
                    this.formGroup.value.salesInvoiceItemList.splice(id, 1);
                    this.fillSalesInvoiceItems();
                    this.calculateTotal();
                }
            });
        }
    }

    public onEnter(price: string, dt: DataTable) {
        if (this.salesInvoiceItemFormGroup.valid) {
            let values = this.salesInvoiceItemFormGroup.value;
            if (this.formGroup.value.salesInvoiceItemList == null) {
                this.formGroup.value.salesInvoiceItemList = [];
            }
            values.amount = values.price * values.quantity;
            this.formGroup.value.salesInvoiceItemList.push(values);
            this.calculateTotal();
            this.salesInvoiceItemFormGroup.reset();
            document.getElementById('itemSelector').focus();
            this.formGroup.value.salesInvoiceItemList = this.formGroup.value.salesInvoiceItemList.slice();
        }

    }

    calculateTotal() {
        let amount = 0;
        let quantity = 0;
        for (let i = 0; i < this.formGroup.value.salesInvoiceItemList.length; i++) {
            let salesInvoiceItem = this.formGroup.value.salesInvoiceItemList[i];
            salesInvoiceItem.amount = salesInvoiceItem.quantity * salesInvoiceItem.price;
            amount += parseInt(salesInvoiceItem.amount);
            quantity += parseInt(salesInvoiceItem.quantity);
        }
        this.formGroup.value.amount = amount;
        this.formGroup.value.quantity = quantity;
    }

    /*================== Item Filter ===================*/
    filteredItems: any[];

    filterItems(event) {
        let query = event.query.toLowerCase();
        this.filteredItems = [];
        for (let i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            if (item.code.toLowerCase().indexOf(query) == 0 || item.name.toLowerCase().indexOf(query) == 0) {
                this.filteredItems.push(item);
            }
        }
    }

    handleItemDropdownClick() {
        this.filteredItems = [];
        //mimic remote call
        setTimeout(() => {
            this.filteredItems = this.itemList;
        }, 100)
    }

    onItemSelect(event: any) {

        this.setDisplayOfItem();
    }

    setDisplayOfItem() {
        let item = this.salesInvoiceItemFormGroup.value.item;
        if (item != null && item != undefined) {
            let display = item.code != null && item.code != undefined ? item.code + ' : ' : '';
            display += item.name != null && item.name != undefined ? item.name : '';
            this.salesInvoiceItemFormGroup.value.item.display = display;
        }
    }
    /*================== End Of  Item Filter ===================*/
}