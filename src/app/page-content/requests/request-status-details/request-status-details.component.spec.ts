import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusDetailsComponent } from './request-status-details.component';

describe('RequestStatusDetailsComponent', () => {
  let component: RequestStatusDetailsComponent;
  let fixture: ComponentFixture<RequestStatusDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestStatusDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
