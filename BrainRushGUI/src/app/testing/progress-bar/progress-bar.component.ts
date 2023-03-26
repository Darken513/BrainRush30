import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input() tests: Array<any> = new Array<any>();
  @Input() currentStep: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  getStepIconMargin(index: number) {
    let nbrSteps = this.tests.length;
    return `calc(calc(calc(100% - 30px) / ${nbrSteps - 1}) * ${index})`
  }
  getProgressBarWidth() {
    let nbrSteps = this.tests.length;
    return `calc(calc(100% / ${nbrSteps - 1}) * ${this.currentStep})`
  }
}
