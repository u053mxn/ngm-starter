import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PanelCardComponent} from './panel-card.component';
import {UiElementsModule} from '../ui-elements.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PanelCardComponent', () => {
  let component: PanelCardComponent;
  let fixture: ComponentFixture<PanelCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiElementsModule,
        HttpClientTestingModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
