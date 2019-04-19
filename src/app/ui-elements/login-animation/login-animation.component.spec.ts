import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAnimationComponent } from './login-animation.component';

describe('LoginAnimationComponent', () => {
  let component: LoginAnimationComponent;
  let fixture: ComponentFixture<LoginAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
