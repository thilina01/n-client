import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { SharedService } from '../../../../services/shared.service';
import { ItemService } from "../../item.service";
import { ItemTypeService } from '../../../itemType/itemType.service';

@Component({
    selector: 'item-form',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./itemForm.scss'],
    templateUrl: './itemForm.html',
})
export class ItemForm {
    itemTypeList: any;
    // itemTypes: any;
    JSON: any = JSON;
    checked: boolean = false;
    public formGroup: FormGroup;
    item: any = {};
    subscription: Subscription;
    itemType: any = { id: '', code: '', type: '' }

    constructor(protected service: ItemService,
        private route: ActivatedRoute,
        private router: Router,
        fb: FormBuilder,
        private itemTypeService: ItemTypeService,
        private sharedService: SharedService,
    ) {
        this.formGroup = fb.group({
            id: '',
            code: ['', Validators.required],
            name: ['', Validators.required],
            itemType: [this.itemType, Validators.required],
        });
    }

    getItemTypes(): void {
        this.itemTypeService.getCombo().subscribe(itemTypeList => this.itemTypeList = itemTypeList);
    }

    ngOnInit(): void {
        this.getItemTypes();
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
        if (data == null) {
            return;
        }
        this.item = data;
        this.formGroup.patchValue(this.item, { onlySelf: true });
        this.itemType = this.item.itemType;
        this.setDisplayOfItemType();

    }

    public onSubmit(values: any, event: Event): void {
        event.preventDefault();
        console.log(values);

        values.drawingApproval = values.drawingApproval ? "yes" : "no";
        values.productionToolAvailability = values.productionToolAvailability ? "yes" : "no";
        this.service.save(values).subscribe(
            (data) => {
                this.sharedService.addMessage({ severity: 'info', summary: 'Success', detail: 'Operation Success' });
                this.resetForm();
                this.router.navigate(['/pages/item/form/']);
            }
        );
    }

    public resetForm() {
        this.formGroup.reset();
    }

    /*================== Item Type Filter ===================*/
    filteredItemTypes: any[];
    // itemType: any;

    filterItemTypes(event) {
        let query = event.query.toLowerCase();
        this.filteredItemTypes = [];
        for (let i = 0; i < this.itemTypeList.length; i++) {
            let itemType = this.itemTypeList[i];
            if (itemType.code != null && itemType.code.toLowerCase().indexOf(query) == 0 || itemType.name != null && itemType.name.toLowerCase().indexOf(query) == 0) {
                this.filteredItemTypes.push(itemType);
            }
        }
    }

    handleItemTypeDropdownClick() {
        this.filteredItemTypes = [];
        //mimic remote call
        setTimeout(() => {
            this.filteredItemTypes = this.itemTypeList;
        }, 100)
    }

    onItemTypeSelect
        (event: any) {

        this.setDisplayOfItemType();

    }
    setDisplayOfItemType() {
        let itemType = this.formGroup.value.itemType;
        if (itemType != null && itemType != undefined) {
            let display = itemType.code != null && itemType.code != undefined ? itemType.code + " : " : "";
            display += itemType.name != null && itemType.name != undefined ? itemType.name : "";
            this.formGroup.value.itemType.display = display;
        }
    }

    /*================== End Of Item Type Filter ===================*/


}