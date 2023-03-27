import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-score-wrapper',
  templateUrl: './score-wrapper.component.html',
  styleUrls: ['./score-wrapper.component.scss']
})
export class ScoreWrapperComponent implements OnInit, AfterViewInit {
  @Input() scoreObj: any;

  constructor() { }
  ngAfterViewInit(): void {
      document.getElementById("title-"+this.scoreObj.id)!.innerHTML = this.scoreObj.text
  }

  ngOnInit(): void {
    this.scoreObj.scoreperc = 'calc(' + this.scoreObj.score + '%' + ' + 1px)'
  }
  getBGColor() {
    if (this.scoreObj.score < 30)
      return '#ed4a3e';
    if (this.scoreObj.score < 60)
      return '#f5f553';
    return '#96c928';
  }
}
