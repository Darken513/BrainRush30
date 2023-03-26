import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsTestComponent } from './keywords-test.component';

xdescribe('KeywordsTestComponent', () => {
  let component: KeywordsTestComponent;
  let fixture: ComponentFixture<KeywordsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeywordsTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeywordsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
