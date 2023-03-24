import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  difficulty: Array<any> = new Array(10);
  daysProgress: Array<any> = new Array(30).fill(1);
  currentDay: number = 26;
  currUser: any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.daysProgress = this.daysProgress.map((val, idx) => {
      return {
        difficulty: new Array(Math.floor(idx / 3) < 1 ? 1 : Math.floor(idx / 3)).fill(1),
        grade: this.getGrade()
      }
    });
    this.currUser = this.authService.getCurrentUser();
  }
  getGrade() {
    let rand = Math.floor(Math.random() * 3)
    switch (rand) {
      case 0:
        return "acceptable"
        break;
      case 1:
        return "good"
        break;
      case 2:
        return "Excelent"
        break;

      default:
        return 'acceptable'
        break;
    }
  }
  logout(): void {
    this.authService.logout();
  }
}
