import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseQueriesComponent } from './raise-queries.component';

describe('RaiseQueriesComponent', () => {
  let component: RaiseQueriesComponent;
  let fixture: ComponentFixture<RaiseQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaiseQueriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiseQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
