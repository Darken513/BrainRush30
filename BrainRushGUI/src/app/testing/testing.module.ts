import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { TestComponent } from './test/test.component';
import { FormsModule } from '@angular/forms';
import { KeywordsTestComponent } from './keywords-test/keywords-test.component';
import { LoadingComponent } from './loading/loading.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TextToHideComponent } from './text-to-hide/text-to-hide.component';
import { TimerComponent } from './timer/timer.component';
import { GradingComponent } from './grading/grading.component';



@NgModule({
  declarations: [
    TextToSpeechComponent,
    TestComponent,
    KeywordsTestComponent,
    LoadingComponent,
    ProgressBarComponent,
    TextToHideComponent,
    TimerComponent,
    GradingComponent
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
