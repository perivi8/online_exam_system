import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateExamComponent } from './evaluate-exam.component';

describe('EvaluateExamComponent', () => {
  let component: EvaluateExamComponent;
  let fixture: ComponentFixture<EvaluateExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluateExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluateExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
