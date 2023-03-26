import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.textToSpeak = this.test.text;
    if (this.test.answer) {
      this.readOnly = true;
      //todo: and display order
    }
    this.displayedKw = this.test.displayed_keywords.split(',').map((kw: string) => ({ text: kw.trim(), selected: false }));
    this.synth = window.speechSynthesis;
    this.synth!.cancel();
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
