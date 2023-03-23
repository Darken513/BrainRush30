import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  
  difficulty:Array<any> = new Array(10);
  daysProgress:Array<any> = new Array(30);
  currentDay:number = 15;
  currUser: any;

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.daysProgress = this.daysProgress.map((val, idx)=>idx);
    this.currUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
