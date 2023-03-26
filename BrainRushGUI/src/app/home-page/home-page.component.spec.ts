import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { HomeService } from '../home.service';
import { NotificationService } from '../notification.service';

import { HomePageComponent } from './home-page.component';

//todo
xdescribe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let homeServiceSpy: jasmine.SpyObj<HomeService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  /*
    const generalFetch = [{"id":6,"user_id":1,"test_id":6,"score":70,"attempted_at":"2023-03-25 19:43:58","day":1,"max(score)":70},{"id":22,"user_id":1,"test_id":22,"score":70,"attempted_at":"2023-03-25 22:51:30","day":2,"max(score)":70}];
    let topass = {subscribe: (fn: any) => fn.next(signUpResponse)}
    authServiceSpy.signUp.and.returnValue(topass as Observable<any>)
  */
  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const homeSpy = jasmine.createSpyObj('HomeService', ['fetchGeneral']);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonModule, ReactiveFormsModule],
      declarations: [HomePageComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: HomeService, useValue: homeSpy },
        { provide: NotificationService, useValue: notifSpy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    homeServiceSpy = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on initialization', () => {
    it('should fetch general data', () => {
      const generalFetch = [{ "id": 6, "user_id": 1, "test_id": 6, "score": 70, "attempted_at": "2023-03-25 19:43:58", "day": 1, "max(score)": 70 }, { "id": 22, "user_id": 1, "test_id": 22, "score": 70, "attempted_at": "2023-03-25 22:51:30", "day": 2, "max(score)": 70 }];
      let topass = { subscribe: (fn: any) => fn.next(generalFetch) }
      homeServiceSpy.fetchGeneral.and.returnValue(topass as Observable<any>);

      component.ngOnInit();

      expect(homeServiceSpy.fetchGeneral).toHaveBeenCalled();
      expect(component.fetchedGeneral).toEqual(generalFetch);
      expect(component.currentDay).toEqual(generalFetch.length + 1);
      expect(component.daysProgress[0].grade).toEqual('Excelent');
      expect(component.daysProgress[1].grade).toEqual('good');
      expect(component.daysProgress[2].grade).toEqual('good');
    });

    it('should get current user', () => {
      const user = { username: 'testuser' };
      authServiceSpy.getCurrentUser.and.returnValue(user);

      component.ngOnInit();

      expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
      expect(component.currUser).toEqual(user);
    });
  });

  describe('getGrade()', () => {
    it('should return "acceptable" for scores below or equal to 60', () => {
      expect(component.getGrade(0)).toEqual('acceptable');
      expect(component.getGrade(60)).toEqual('acceptable');
    });

    it('should return "good" for scores above 60 and below 80', () => {
      expect(component.getGrade(61)).toEqual('good');
      expect(component.getGrade(79)).toEqual('good');
    });

    it('should return "Excelent" for scores 80 and above', () => {
      expect(component.getGrade(80)).toEqual('Excelent');
      expect(component.getGrade(100)).toEqual('Excelent');
    });
  });

  describe('cardClicked()', () => {
    it('should show error notification for locked tests', () => {
      component.currentDay = 1;
      spyOn(notificationServiceSpy, 'showNotification');
      component.cardClicked(2);

      expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith('Error', 'Test is yet to be locked');
    });

    it('should display modal for current day', () => {
      component.currentDay = 2;
      spyOn(component, 'initNewTest');

      component.cardClicked(2);

      expect(component.initNewTest).not.toHaveBeenCalled();
      expect(component.displayModal).toBeTrue();
    });
  });

  describe('initNewTest()', () => {
    it('should navigate to new test with current day', () => {
      component.currentDay = 2;
      spyOn(component.router, 'navigate');
      component.initNewTest();

      expect(component.router.navigate).toHaveBeenCalledWith(['/test/new', 2]);
    });
  });

  describe('logout()', () => {
    it('should call authService.logout()', () => {
      spyOn(authServiceSpy, 'logout');
      component.logout();

      expect(authServiceSpy.logout).toHaveBeenCalled();
    });
  });
});