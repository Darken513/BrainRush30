import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash'
@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./../keywords-test/keywords-test.component.scss', './text-to-speech.component.scss']
})
export class TextToSpeechComponent implements OnInit {
  @Input() test: any;
  @Input() isLast: boolean = false;
  @Output() next = new EventEmitter<boolean>();
  public readOnly: any = false;
  public ready: boolean = false;

  public displayedKw: Array<any> = new Array<any>();
  public textToSpeak: string = '';
  public answer: string = '';

  public listened: boolean = false;
  public synth!: SpeechSynthesis;
  public correctAns:Array<string> = new Array<string>;
  public wrongAns:Array<string> = new Array<string>;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.textToSpeak = this.test.text;
    if (this.test.answer) {
      this.readOnly = true;
      let answers = this.test.answer.split(',').map((word:string) => word.trim());
      let correctAns = this.test.keywords.split(',').map((word:string) => word.trim());
      this.correctAns = _.intersection(answers, correctAns);
      this.wrongAns = _.difference(_.union(answers, correctAns), this.correctAns);
    }
    this.displayedKw = this.test.displayed_keywords.split(',').map((kw: string) => ({ text: kw.trim(), selected: false }));
    this.synth = window.speechSynthesis;
    this.synth!.cancel();
  }
  public getCorrectionColor(word:string){
    if(this.wrongAns.includes(word))
      return "#df3030"
    if(this.correctAns.includes(word))
      return "yellowgreen"
    return;
  }
  redirect() {
    this.router.navigate(['/home']);
  }
  toScorePage(){
    this.next.emit(true);
  }
  public onKWBtnClick(index:number){
    if(!this.listened)
      return;
    this.displayedKw[index].selected = !this.displayedKw[index].selected;
  }
  public speak(): void {
    this.listened = true;
    const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
    utterance.onend = () => {
      this.synth.cancel();
    };
    this.synth.speak(utterance);
  }

  initTest() {
    this.ready = true;
  }
  canVisitNext() { 
    return this.readOnly || this.displayedKw.some(kw=>kw.selected);
  }
  saveAndExit() {
    if (!this.readOnly) {
      this.test.answer = this.displayedKw.filter(kw=>kw.selected).map(kw => kw.text).join(', ');
      console.log(this.test.answer);
    }
    this.next.emit(true);
  }
}
