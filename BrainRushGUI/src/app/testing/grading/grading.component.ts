import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  @Input() generalResult: any;
  @Input() testDetails: any;

  constructor() { }

  ngOnInit(): void {
  }

}
