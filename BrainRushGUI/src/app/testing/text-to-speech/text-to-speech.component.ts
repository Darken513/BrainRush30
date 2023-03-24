import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.scss']
})
export class TextToSpeechComponent implements OnInit {

  public textToSpeak: string = "The text to speak goes here ! probably will be fetched from a database & procedurally generated";
  public isSpeaking!: boolean;
  public synth!: SpeechSynthesis;

  constructor() { }

  ngOnInit() {
    this.synth = window.speechSynthesis;
  }

  public speak(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

}
