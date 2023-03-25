import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { TestComponent } from './test/test.component';
import { FormsModule } from '@angular/forms';
import { KeywordsTestComponent } from './keywords-test/keywords-test.component';



@NgModule({
  declarations: [
    TextToSpeechComponent,
    TestComponent,
    KeywordsTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    TestComponent
  ]
})
export class TestingModule { }
