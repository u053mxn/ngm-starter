import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ui-action-button-container',
  templateUrl: './action-button-container.component.html',
  styleUrls: ['./action-button-container.component.scss']
})
export class ActionButtonContainerComponent implements OnInit {
  @Input() animation;
  constructor() { }

  ngOnInit() {
  }

}
