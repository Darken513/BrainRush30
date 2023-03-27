import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

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
  public correctAns:Array<string> = new Array<string>;
  public wrongAns:Array<string> = new Array<string>;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.sentence = this.test.text;
    if (this.test.answer) {
      this.readOnly = true;
      let answers = this.test.answer.split(',').map((word:string) => word.trim());
      let correctAns = this.test.keywords.split(',').map((word:string) => word.trim());
      this.correctAns = _.intersection(answers, correctAns);
      this.wrongAns = _.difference(_.union(answers, correctAns), this.correctAns);
      console.log({
        answers,
        wrongAns: this.wrongAns,
        correctAns: correctAns
      });
    }
    this.displayedKw = this.test.displayed_keywords.split(',').map((kw: string) => ({ text: kw.trim(), selected: false }));
    this.displaySeconds = this.getTimerSeconds();
  }
  public onKWBtnClick(index: number) {
    if(this.readOnly)
      return;
    this.displayedKw[index].selected = !this.displayedKw[index].selected;
  }
  public getCorrectionColor(word:string){
    if(this.wrongAns.includes(word))
      return "#df3030"
    if(this.correctAns.includes(word))
      return "yellowgreen"
    return;
  }
  getTimerSeconds() {
    return Math.round(this.test.text.length / 10 * this.test.difficulty * 0.75)
  }
  initTest() {
    this.ready = true;
  }
  redirect() {
    this.router.navigate(['/home']);
  }
  toScorePage(){
    this.next.emit(true);
  }
  canVisitNext() {
    return this.readOnly || this.displayedKw.some(kw => kw.selected);
  }
  saveAndExit() {
    if (!this.readOnly) {
      this.test.answer = this.displayedKw.filter(kw => kw.selected).map(kw => kw.text).join(', ');
    }
    this.next.emit(true);
  }
}
