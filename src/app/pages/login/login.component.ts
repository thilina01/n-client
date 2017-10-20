import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import 'style-loader!./login.scss';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    selector: 'login',
    templateUrl: './login.html',
})
export class Login {

    public form: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    public submitted: boolean = false;

    constructor(fb: FormBuilder,
        public authService: AuthService,
        public router: Router) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
        });

        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
    }
    ngOnInit() {
        this.authService.logout();
    }

    public onSubmit(values: any): void {
        this.submitted = true;
        if (this.form.valid) {
            this.authService.login(values).subscribe(response => {
                if (response) {
                    Cookie.set('email', values.email);
                    // this.authService.email = values.email;
                    this.router.navigate([this.authService.redirectUrl]);
                } else {
                    alert("Login Failed")
                }
            });

            /*
                        this.authService.login(values).then(() => {
                            if (this.authService.isLoggedIn) {
                                let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/pages/plan';
                                this.router.navigate([redirect]);
                                //window.location.href = '/#' + redirect;
                            }
                        });*/
        }
    }
}
