import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocsComponent } from './search-docs.component';

describe('SearchDocsComponent', () => {
  let component: SearchDocsComponent;
  let fixture: ComponentFixture<SearchDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
