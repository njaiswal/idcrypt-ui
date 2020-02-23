import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestConfirmComponent } from './request-confirm.component';

describe('RequestConfirmComponent', () => {
  let component: RequestConfirmComponent;
  let fixture: ComponentFixture<RequestConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
