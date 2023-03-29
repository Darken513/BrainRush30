import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./../login-page/login-page.component.scss', './profile.component.scss']
})
export class ProfileComponent implements OnInit {

  signupForm!: FormGroup;
  currUserConf: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifService: NotificationService
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      NotifDate: ['', [Validators.required]]
    });
    this.currUserConf = this.authService.getCurrentUser();
    this.signupForm.get('username')?.setValue(this.currUserConf.username)
    this.signupForm.get('NotifDate')?.setValue(this.currUserConf.notif_time)
  }
  redirect() {
    this.router.navigate(['/home']);
  }
  changeAppTheme() {
    this.currUserConf.design_mode = !this.currUserConf.design_mode;
    if (this.currUserConf.design_mode) {
      document.body.style.filter = "none"
      return;
    }
    document.body.style.filter = "invert(1) hue-rotate(60deg)"
  }
  onSubmit() {
    if (this.signupForm.valid) {
      const { username, NotifDate } = this.signupForm.value;
      this.authService.saveConf(username, NotifDate, this.currUserConf.design_mode)
        .subscribe({
          next: (response: any) => {
            this.authService.setToken(response.token, true)
            this.notifService.showNotification('Success', 'Account details updated');
            this.ngOnInit()
          },
          error: (error: any) => {
            console.log(error)
          }
        });
    }
  }

}
