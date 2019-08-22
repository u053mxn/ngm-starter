import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UiElementsModule} from '../ui-elements.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FaIconCircleComponent} from './fa-icon-circle.component';

describe('FaIconCircle', () => {
  let component: FaIconCircleComponent;
  let fixture: ComponentFixture<FaIconCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiElementsModule,
        HttpClientTestingModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaIconCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
