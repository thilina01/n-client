import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { SharedService } from '../../../../services/shared.service';
import { StockService } from '../../stock.service';
import { ItemService } from '../../../item/item.service';

@Component({
    selector: 'stock-form',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./stockForm.scss'],
    templateUrl: './stockForm.html',
})
export class StockForm {
    item: any;
    stockType: any;
    itemList: any;
    JSON: any = JSON;

    public formGroup: FormGroup;
    subscription: Subscription;
    stock: any = {};

    constructor(protected service: StockService,
        private route: ActivatedRoute,
        private router: Router,
        fb: FormBuilder,
        private itemService: ItemService,
        private sharedService: SharedService) {
        this.formGroup = fb.group({
            id: '',
            code: ['', Validators.required],
            sellingPrice: '',
            item: [{}, Validators.compose([Validators.required])]

        });
    }

    getItemList(): void {
        this.itemService.getCombo().subscribe(itemList => this.itemList = itemList);
    }

    ngOnInit(): void {
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
            this.stock = data;
        }
        this.formGroup.patchValue(this.stock, { onlySelf: true });
        this.stockType = this.stock.stockType;
        this.item = this.stock.item;
        this.setDisplayOfItem();
    }

    public onSubmit(values: any, event: Event): void {
        event.preventDefault();
        console.log(values);
        this.service.save(values).subscribe(
            (data) => {
                this.sharedService.addMessage({ severity: 'info', summary: 'Success', detail: 'Operation Success' });
                this.resetForm();
                this.router.navigate(['/pages/Stock/form/']);
            }
        );
    }

    public resetForm() {
        this.formGroup.reset();
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
        let item = this.formGroup.value.item;
        if (item != null && item != undefined) {
            let display = item.code != null && item.code != undefined ? item.code + ' : ' : '';
            display += item.name != null && item.name != undefined ? item.name : '';
            this.formGroup.value.item.display = display;
        }
    }
    /*================== End Of  Item Filter ===================*/


}
