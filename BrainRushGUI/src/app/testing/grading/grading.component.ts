import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  @Input() generalResult: any;
  @Input() testDetails: any;
  @Input() day: number = 0;
  currentStep: number = -1;
  retryModal:boolean = false;
  generalGradesArr: Array<any> = new Array<any>();
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    let passingScore = this.generalResult.passing_grade
    this.generalGradesArr = _.map(this.generalResult, (val, idx) => {
      switch (idx) {
        case "totalGrade":
          return { text: '<span style="color:#49c49b">Total score</span>', id: idx, score: val, passingScore }
        case "textToSpeechGrade":
          return { text: 'Total <span style="color:#49c49b">audible</span> memory score', id: idx, score: val, passingScore }
        case "generatedKwGrade":
          return { text: 'Total <span style="color:#49c49b">contextual</span> memory score', id: idx, score: val, passingScore }
        case "textToHideGrade":
          return { text: 'Total <span style="color:#49c49b">visual</span> memory score', id: idx, score: val, passingScore }
        default:
          return undefined;
      }
    }).filter(x => x);
  }

  redirect() {
    this.router.navigate(['/home']);
  }
  retakeTest(){
    this.router.navigate(['/test/new', this.day]);
  }

  nextStep() {
    let curr = this.currentStep;
    if (curr == this.testDetails!.length - 1) {
      curr = -2;
    }
    this.currentStep = -2; //hack
    setTimeout(() => {
      this.currentStep = curr + 1;
    }, 150)
  }
}
