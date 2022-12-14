import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    loginFormGroup!: FormGroup;
    isSubmitted = false;
    authError = false;
    authMessage = 'Email or password are wrong';
    constructor (
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) { }
    ngOnInit(): void {
        this._initLoginForm();
    }
    private _initLoginForm() {
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        })
    }
    onSubmit(){
        this.isSubmitted = true;
        if(this.loginFormGroup['invalid']){
            return;
        }

        const loginData = {
            email: this.loginForm['email'].value,
            password: this.loginForm['password'].value
        }
        this.auth.login(loginData.email,loginData.password).subscribe(
            (user) => {
            this.authError = false;
            this.localStorageService.setUserName(loginData.email);
            this.localStorageService.setToken(user.token);
            this.router.navigate(['/']);
            setTimeout(() => window.location.reload(), 1000);
            },
        (error: HttpErrorResponse) => {
            this.authError = true;
            if(error.status !== 400){
                this.authMessage = 'Error in ther Server. Please try again later.'
            }
        }
        )
    }
    get loginForm(){
        return this.loginFormGroup.controls;
    }

}
