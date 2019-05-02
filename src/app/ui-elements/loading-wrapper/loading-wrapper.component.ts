import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ui-loading-wrapper',
  templateUrl: './loading-wrapper.component.html',
  styleUrls: ['./loading-wrapper.component.scss']
})
export class LoadingWrapperComponent implements OnInit {
  @Input() spinnerSize = 3;
  @Input() isLoading: boolean;
  @Input() contentName: string;
  @Input() hideText: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
