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
  testRes: any;
  displayModal: boolean = false;
  reviewMode: boolean = false;
  loading: boolean = true;
  currentStep: number = 0;
  tests: Array<any> | undefined;
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
    } else if (route.includes('review')) {
      this.activatedRoute.params.subscribe(params => {
        this.treatCaseReview(params['test_id'])
      });
    }
  }
  treatCaseReview(test_id: number) {
    this.testingService.getTestReview(test_id).subscribe({
      next: (reviewRes) => {
        this.reviewMode = true;
        this.testRes = reviewRes.test.userAttempResult;
        this.testWrapper = reviewRes;
        this.tests = this.testWrapper.test.tests;
        this.loading = false;
        setTimeout(() => {
          let elm = document.getElementById('test-wrapper');
          elm!.style!.top = 'calc((100vh - 500px) / 2)'
        }, 200);
      },
      error: (err) => { }
    })
  }
  treatCaseNew(day: number) {
    this.testingService.generateTest(day).subscribe({
      next: (res) => {
        this.loading = false;
        this.testWrapper = res;
        this.tests = this.testWrapper.test.tests;
        setTimeout(() => {
          let elm = document.getElementById('test-wrapper');
          elm!.style!.top = 'calc((100vh - 500px) / 2)'
        }, 200);
      },
      error: (error) => {
        this.displayModal = true;
        return;
      }
    })
  }
  nextStep() {
    let curr = this.currentStep;
    if (curr == this.tests!.length - 1) {
      this.loading = true;
      this.testingService.gradeTest(this.testWrapper).subscribe({
        next: (res) => {
          this.testRes = res.userAttempResult;
          this.testingService.getTestReview(res.userAttempResult.test_id).subscribe({
            next: (reviewRes) => {
              this.router.navigate(['/test/review', reviewRes.test_id]);
            },
            error: (err) => { }
          })
        },
        error: (err) => { }
      });
      this.tests = undefined;
      this.testWrapper = undefined;
      return;
    }
    this.currentStep = -1; //hack
    setTimeout(() => {
      this.currentStep = curr + 1;
    }, 150)
  }
  redirect() {
    this.router.navigate(['/home']);
  }

}