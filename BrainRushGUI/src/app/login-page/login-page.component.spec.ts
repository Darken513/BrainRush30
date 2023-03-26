import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthService;
  let notifService: NotificationService;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPageComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        AuthService,
        NotificationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    notifService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    expect(component.loginForm.valid).toBeTruthy();
  });
  it('should call the authService login method', () => {
    spy = spyOn(authService, 'login').and.returnValue(of({ title: 'TestTitle', body: 'TestBody' }));
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.onSubmit();
    expect(authService.login).toHaveBeenCalled();
  });

  it('should call the notifService showNotification method', () => {
    spyOn(authService, 'login').and.returnValue(of({ title: 'TestTitle', body: 'TestBody' }));
    spy = spyOn(notifService, 'showNotification').and.callThrough();
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.onSubmit();
    expect(notifService.showNotification).toHaveBeenCalledWith('TestTitle', 'TestBody');
  });
});