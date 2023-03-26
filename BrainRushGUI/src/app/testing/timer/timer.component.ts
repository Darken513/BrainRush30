import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() seconds!:number;
  initSeconds!:number;
  @Output() timesUp = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
    this.initSeconds = this.seconds;
    this.tick()
  }
  tick(){
    setTimeout(() => {
      this.seconds -= 1;
      if(!this.seconds){
        this.timesUp.emit(true)
        return;
      }
      this.tick()
    }, 1000);
  }

}
