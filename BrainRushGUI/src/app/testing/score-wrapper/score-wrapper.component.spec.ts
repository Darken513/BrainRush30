import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreWrapperComponent } from './score-wrapper.component';

describe('ScoreWrapperComponent', () => {
  let component: ScoreWrapperComponent;
  let fixture: ComponentFixture<ScoreWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
