import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TitleTextComponent} from './title-text.component';
import {UiElementsModule} from '../ui-elements.module';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

@Component({
  selector: 'test-cmp',
  template: `
        <ui-title-text>{{testPhrase}}</ui-title-text>`,
})
class TestWrapperComponent {
  testPhrase = 'test';
}

describe('TitleTextComponent', () => {
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

  it('ng-content should have inner text', () => {
    const ngContentEl = fixture.debugElement.query(By.css('.text'));
    expect(ngContentEl.nativeElement.innerText).toBe(component.testPhrase);
  });
});
