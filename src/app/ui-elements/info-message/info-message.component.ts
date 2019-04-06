import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-message',
  template: `
    <article class="flex-center-around card-accent animated fadeInRight animate-fast" style="font-size: 0.9em">
      <mat-icon style="margin-right: 0.8em; color: #616161">info</mat-icon>
      <ng-content></ng-content>
    </article>
  `
})
export class InfoMessageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
