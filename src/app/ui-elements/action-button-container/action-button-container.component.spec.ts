import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButtonContainerComponent } from './action-button-container.component';

describe('ActionButtonContainerComponent', () => {
  let component: ActionButtonContainerComponent;
  let fixture: ComponentFixture<ActionButtonContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionButtonContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionButtonContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
