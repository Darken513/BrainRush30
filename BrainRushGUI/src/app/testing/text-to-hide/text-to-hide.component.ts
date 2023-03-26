import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-to-hide',
  templateUrl: './text-to-hide.component.html',
  styleUrls: ['./../keywords-test/keywords-test.component.scss', './../text-to-speech/text-to-speech.component.scss', './text-to-hide.component.scss']
})
export class TextToHideComponent implements OnInit {
  @Input() test: any;
  @Input() isLast: boolean = false;
  @Output() next = new EventEmitter<boolean>();

  public readOnly: any = false;
  public ready: boolean = false;

  public displayedKw: Array<any> = new Array<any>();
  public sentence: string = '';
  public answer: string = '';
  timeEnded: boolean = false;
  displaySeconds: number = 5;

  constructor() { }

  ngOnInit() {
    this.sentence = this.test.text;
    if (this.test.answer) {
      this.readOnly = true;
      //todo: and display order
    }
    this.displayedKw = this.test.displayed_keywords.split(',').map((kw: string) => ({ text: kw.trim(), selected: false }));
    this.displaySeconds = this.getTimerSeconds();
  }
  public onKWBtnClick(index: number) {
    this.displayedKw[index].selected = !this.displayedKw[index].selected;
  }
  getTimerSeconds() {
    return Math.round(this.test.text.length / 10 * this.test.difficulty * 0.75)
  }
  initTest() {
    this.ready = true;
  }
  canVisitNext() {
    return this.readOnly || this.displayedKw.some(kw => kw.selected);
  }
  saveAndExit() {
    if (!this.readOnly) {
      this.test.answer = this.displayedKw.filter(kw => kw.selected).map(kw => kw.text).join(', ');
      console.log(this.test.answer);
    }
    this.next.emit(true);
  }
}
