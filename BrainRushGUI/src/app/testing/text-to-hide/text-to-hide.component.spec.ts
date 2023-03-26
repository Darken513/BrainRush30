import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToHideComponent } from './text-to-hide.component';

describe('TextToHideComponent', () => {
  let component: TextToHideComponent;
  let fixture: ComponentFixture<TextToHideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextToHideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextToHideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
