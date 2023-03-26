import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestingService } from '../testing.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  testWrapper: any;
  gk_test: any;
  displayModal: boolean = false;
  constructor(
    private testingService: TestingService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let route = this.router.url;
    if (route.includes('new')) {
      this.activatedRoute.params.subscribe(params => {
        this.treatCaseNew(params['day'])
      });
    }

  }
  treatCaseNew(day: number) {
    this.testingService.generateTest(day).subscribe({
      next: (res) => {
        this.testWrapper = res;
        if (this.testWrapper) {
          this.gk_test = this.testWrapper.test.tests.find((val: any) => val.type == "GK")
        }
      },
      error: (error) => {
        this.displayModal = true;
        return;
      }
    })
  }
  redirect() {
    this.router.navigate(['/home']);
  }

}
