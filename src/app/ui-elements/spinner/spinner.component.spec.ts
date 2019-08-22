import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpinnerComponent} from './spinner.component';
import {UiElementsModule} from '../ui-elements.module';
import {Component} from '@angular/core';

@Component({
  selector: 'test-cmp',
  template: `
        <ui-spinner [size]="size"></ui-spinner>`,
})
class TestWrapperComponent {
  size: 2;
}

describe('SpinnerComponent', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestWrapperComponent],
      imports: [
        UiElementsModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
