import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login-animation',
  templateUrl: './login-animation.component.html',
  styleUrls: ['./login-animation.component.scss']
})
export class LoginAnimationComponent implements OnInit {
  // Can only use 7 words. Cannot be longer than 'Government Travel'
  wordList = ['EASY PAYMENT', 'HOTELS', 'FLIGHTS', 'GOVERNMENT TRAVEL', 'AIRFARE', 'TRAVEL', 'USER EXPERIENCE'];

  constructor() {
  }

  ngOnInit() {
  }
}
