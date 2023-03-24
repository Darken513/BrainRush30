import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { TestComponent } from './test/test.component';



@NgModule({
  declarations: [
    TextToSpeechComponent,
    TestComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TestComponent
  ]
})
export class TestingModule { }
