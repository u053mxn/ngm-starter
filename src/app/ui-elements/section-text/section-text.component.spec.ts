import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SectionTextComponent} from './section-text.component';
import {UiElementsModule} from '../ui-elements.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SectionTextComponent', () => {
  let component: SectionTextComponent;
  let fixture: ComponentFixture<SectionTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiElementsModule,
        HttpClientTestingModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
