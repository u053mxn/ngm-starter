import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingWrapperComponent} from './loading-wrapper.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UiElementsModule} from '../ui-elements.module';

describe('LoadingWrapperComponent', () => {
  let component: LoadingWrapperComponent;
  let fixture: ComponentFixture<LoadingWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiElementsModule,
        HttpClientTestingModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
