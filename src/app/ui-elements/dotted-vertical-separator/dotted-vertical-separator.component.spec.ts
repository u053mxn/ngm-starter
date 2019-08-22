import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DottedVerticalSeparatorComponent } from './dotted-vertical-separator.component';

describe('DottedVerticalSeparatorComponent', () => {
  let component: DottedVerticalSeparatorComponent;
  let fixture: ComponentFixture<DottedVerticalSeparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DottedVerticalSeparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DottedVerticalSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
