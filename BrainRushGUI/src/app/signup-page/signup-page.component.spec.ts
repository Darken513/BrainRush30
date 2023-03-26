import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Operator, Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupPageComponent } from './signup-page.component';

describe('SignupPageComponent', () => {
  let component: SignupPageComponent;
  let fixture: ComponentFixture<SignupPageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['signUp']);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      declarations: [SignupPageComponent],
      imports: [HttpClientTestingModule], 
      providers: [
        FormBuilder,
        HttpHandler,
        HttpClient,
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notifSpy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture = TestBed.createComponent(SignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit()', () => {
    it('should call authService.signUp() with correct email and password', () => {
      const email = 'test@example.com';
      const password = 'password123';
      const signUpResponse = { title: 'Success', body: 'You have successfully signed up!' };
      
      let topass = {subscribe: (fn: any) => fn.next(signUpResponse)}
      authServiceSpy.signUp.and.returnValue(topass as Observable<any>)

      const form = component.signupForm as FormGroup;
      form.controls['email'].setValue(email);
      form.controls['password'].setValue(password);
      form.controls['retypePassword'].setValue(password);
      fixture.detectChanges();

      component.onSubmit();

      expect(authServiceSpy.signUp).toHaveBeenCalledWith(email, password);
    });

    it('should call notificationService.showNotification() with correct arguments on success', () => {
      const email = 'test@example.com';
      const password = 'password123';
      const signUpResponse = { title: 'Success', body: 'You have successfully signed up!' };
      let topass = {subscribe: (fn: any) => fn.next(signUpResponse)}
      authServiceSpy.signUp.and.returnValue(topass as Observable<any>);

      const form = component.signupForm as FormGroup;
      form.controls['email'].setValue(email);
      form.controls['password'].setValue(password);
      form.controls['retypePassword'].setValue(password);
      fixture.detectChanges();

      component.onSubmit();

      expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(signUpResponse.title, signUpResponse.body);
    });
    
    it('should not call authService.signUp() when form is invalid', () => {
      const form = component.signupForm as FormGroup;
      form.controls['email'].setValue('invalidemail');
      form.controls['password'].setValue('short');
      form.controls['retypePassword'].setValue('doesnotmatch');
      fixture.detectChanges();

      component.onSubmit();

      expect(authServiceSpy.signUp).not.toHaveBeenCalled();
      expect(notificationServiceSpy.showNotification).not.toHaveBeenCalled();
    });

    it('should check for password match validation', () => {
      component.signupForm.setValue({
        email: 'test@example.com',
        password: 'password',
        retypePassword: 'different_password'
      });
      expect(component.signupForm.invalid).toBeTrue();
    });
  
  })
})