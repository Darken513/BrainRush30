import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HomeService } from '../home.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  difficulty: Array<any> = new Array(10);
  daysProgress: Array<any> = new Array(30).fill({});
  fetchedGeneral!: Array<any>;
  currentDay: number = 1;
  currUser: any;
  displayModal:boolean = false;

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.daysProgress = this.daysProgress.map((val, idx) => {
      return {
        difficulty: new Array(Math.floor(idx / 3) < 1 ? 1 : Math.floor(idx / 3)).fill(1),
      }
    });
  }

  ngOnInit(): void {
    this.homeService.fetchGeneral().subscribe(res => {
      this.fetchedGeneral = res;
      this.currentDay = this.fetchedGeneral.length;
      this.fetchedGeneral.forEach((dayDetail, index) => {
        this.daysProgress[index].grade = this.getGrade(dayDetail.score);
        this.daysProgress[index].details = dayDetail;
      })
    });
    this.currUser = this.authService.getCurrentUser();
  }

  getGrade(score: number) {
    if (score <= 60)
      return "acceptable"
    if (score < 80)
      return "good"
    return "Excelent"
  }

  cardClicked(idx: number){
    if(idx > this.currentDay){
      this.notificationService.showNotification('Error', 'Test is yet to be locked')
      return;
    }
    if(idx == this.currentDay){
      this.displayModal = true;
      return;
    }
    //else should navigate to the old attempt
  }
  initNewTest(){
    this.router.navigate(['/test/new', this.currentDay]);
  }
  logout(): void {
    this.authService.logout();
  }
}
