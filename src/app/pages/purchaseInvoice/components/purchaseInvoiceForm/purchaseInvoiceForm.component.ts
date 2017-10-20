import { Component, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { DataTable, ConfirmationService } from 'primeng/primeng';

import { SharedService } from '../../../../services/shared.service';
import { PurchaseInvoiceService } from '../../purchaseInvoice.service';
import { ItemService } from '../../../item/item.service';

@Component({
    selector: 'purchase-invoice-form',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./purchaseInvoiceForm.scss'],
    templateUrl: './purchaseInvoiceForm.html',
})

export class PurchaseInvoiceForm {
    @Input('formGroup')
    public formGroup: FormGroup;
    @ViewChild(DataTable) dataTable: DataTable;
    public purchaseInvoiceItemFormGroup: FormGroup;

    JSON: any = JSON;

    public FormGroup: FormGroup;
    purchaseInvoice: any = {};
    subscription: Subscription;
    item: Array<any>;
    totalRecords = 0;
    purchaseInvoiceType: any;
    invoiceDate: Date;
    itemList = [];

    constructor(protected service: PurchaseInvoiceService,
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
            purchaseInvoiceItemList: [[]],
        });

        this.purchaseInvoiceItemFormGroup = fb.group({
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

    fillPurchaseInvoiceItems(): void {
        this.formGroup.value.purchaseInvoiceItemList = this.formGroup.value.purchaseInvoiceItemList.slice();
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
            this.purchaseInvoice = data;
        }
        this.formGroup.patchValue(this.purchaseInvoice, { onlySelf: true });
        this.purchaseInvoiceType = this.purchaseInvoice.purchaseInvoiceType;
        this.setDisplayOfItem();
        this.calculateTotal();        
    }

    public onSubmit(values: any, event: Event): void {
        event.preventDefault();
        console.log(values);
        if (values.purchaseInvoiceItemList === null || values.purchaseInvoiceItemList.length === 0) {
            alert('Items Required');
            return;
        }
        this.service.save(values).subscribe(
            (data) => {
                this.sharedService.addMessage({ severity: 'info', summary: 'Success', detail: 'Operation Success' });
                this.resetForm();
                this.router.navigate(['/pages/purchaseInvoice/form/']);
            }
        );
    }

    public resetForm() {
        this.formGroup.reset();
        this.purchaseInvoiceItemFormGroup.reset();
    }

    public removePurchaseInvoiceItem(id: number) {
        if (this.formGroup.value.purchaseInvoiceItemList != null) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Delete?',
                accept: () => {
                    this.formGroup.value.purchaseInvoiceItemList.splice(id, 1);
                    this.fillPurchaseInvoiceItems();
                    this.calculateTotal();
                }
            });
        }
    }

    public onEnter(price: string, dt: DataTable) {
        if (this.purchaseInvoiceItemFormGroup.valid) {
            let values = this.purchaseInvoiceItemFormGroup.value;
            if (this.formGroup.value.purchaseInvoiceItemList == null) {
                this.formGroup.value.purchaseInvoiceItemList = [];
            }
            values.amount = values.price * values.quantity;
            this.formGroup.value.purchaseInvoiceItemList.push(values);
            this.calculateTotal();
            this.purchaseInvoiceItemFormGroup.reset();
            document.getElementById('itemSelector').focus();
            this.formGroup.value.purchaseInvoiceItemList = this.formGroup.value.purchaseInvoiceItemList.slice();
        }

    }

    calculateTotal() {
        let amount = 0;
        let quantity = 0;
        for (let i = 0; i < this.formGroup.value.purchaseInvoiceItemList.length; i++) {
            let purchaseInvoiceItem = this.formGroup.value.purchaseInvoiceItemList[i];
            purchaseInvoiceItem.amount = purchaseInvoiceItem.quantity * purchaseInvoiceItem.price;
            amount += parseInt(purchaseInvoiceItem.amount);
            quantity += parseInt(purchaseInvoiceItem.quantity);
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
        let item = this.purchaseInvoiceItemFormGroup.value.item;
        if (item != null && item != undefined) {
            let display = item.code != null && item.code != undefined ? item.code + ' : ' : '';
            display += item.name != null && item.name != undefined ? item.name : '';
            this.purchaseInvoiceItemFormGroup.value.item.display = display;
        }
    }
    /*================== End Of  Item Filter ===================*/
}