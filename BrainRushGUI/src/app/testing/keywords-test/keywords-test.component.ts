import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-keywords-test',
  templateUrl: './keywords-test.component.html',
  styleUrls: ['./keywords-test.component.scss']
})
export class KeywordsTestComponent implements OnInit {
  @Input() test: any;
  @Input() isLast: boolean = false;
  @Output() next = new EventEmitter<boolean>();
  
  readOnly: any = false;
  sentence!: string;
  ready: boolean = false;
  timeEnded: boolean = false;
  displaySeconds: number = 5;
  shuffledWords: Array<any> = [];
  selectedOrder: Array<any> = [];
  constructor() { }

  ngOnInit(): void {
    if (this.test.answer) {
      this.selectedOrder = this.test.answer.split(',').map((word: string) => ({ text: word.trim(), selected: true, idx: -1 }))
      this.readOnly = true;
      return;
    }
    this.sentence = this.test.keywords.reduce((toret: string, keyw: any, idx: number) => {
      toret += keyw.word + (idx != this.test.keywords.length - 1 ? ' ' : '');
      return toret;
    }, '');
    this.displaySeconds = this.test.keywords.reduce((toret: Number, keyw: any) => {
      toret += keyw.difficulty;
      return toret;
    }, 0)
    this.shuffledWords = this.shuffleArray(this.test.keywords.map((kw: any) => ({ text: kw.word, selected: false })))
    this.selectedOrder = this.shuffledWords.map(word => ({ text: '........', selected: false, idx: -1 }))
  }
  initTest() {
    this.ready = true;
  }
  onTimesUp() {
    this.timeEnded = true;
  }
  onKWBtnClick(index: number) {
    if (this.readOnly)
      return;
    this.shuffledWords[index].selected = true;
    let tochange = this.selectedOrder.find((kw) => !kw.selected);

    tochange.text = this.shuffledWords[index].text;
    tochange.selected = true;
    tochange.idx = index;
  }
  onSelectedKWBtnClick(index: number) {
    if (this.readOnly)
      return;
    if (this.selectedOrder[index].idx == -1)
      return;
    let tochange = this.shuffledWords[this.selectedOrder[index].idx];
    this.selectedOrder[index].selected = false;
    this.selectedOrder[index].text = '........'
    this.selectedOrder[index].idx = -1;
    tochange.selected = false;
  }
  shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  canVisitNext() {
    return !this.shuffledWords.some(kw => !kw.selected)
  }
  saveAndExit() {
    if (!this.readOnly) {
      this.test.answer = this.selectedOrder.map(kw => kw.text).join(', ');
    }
    this.next.emit(true);
  }
}
