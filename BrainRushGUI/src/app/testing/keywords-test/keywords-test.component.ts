import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-keywords-test',
  templateUrl: './keywords-test.component.html',
  styleUrls: ['./keywords-test.component.scss']
})
export class KeywordsTestComponent implements OnInit {
   _gk_test:any;
  public get gk_test() : any {
    return this._gk_test;
  }
  
  @Input() public set gk_test(v : string) {
    console.log(v);
    this._gk_test = v;
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
