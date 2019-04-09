import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwirlBgComponent } from './swirl-bg.component';

describe('SwirlBgComponent', () => {
  let component: SwirlBgComponent;
  let fixture: ComponentFixture<SwirlBgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwirlBgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwirlBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
