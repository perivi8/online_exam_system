import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExamComponent } from './edit-exam.component';

describe('EditExamComponent', () => {
  let component: EditExamComponent;
  let fixture: ComponentFixture<EditExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
