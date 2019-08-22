import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AbstractFormComponent} from './abstract-form.component';
import {UiElementsModule} from '../ui-elements.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AbstractFormComponent', () => {
  let component: AbstractFormComponent;
  let fixture: ComponentFixture<AbstractFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiElementsModule,
        HttpClientTestingModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
