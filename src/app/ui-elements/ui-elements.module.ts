import {NgModule} from '@angular/core';
import {ActionButtonContainerComponent} from './action-button-container/action-button-container.component';
import {InfoMessageComponent} from './info-message/info-message.component';
import {LoadingWrapperComponent} from './loading-wrapper/loading-wrapper.component';
import {PanelCardComponent} from './panel-card/panel-card.component';
import {SectionTextComponent} from './section-text/section-text.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {TitleTextComponent} from './title-text/title-text.component';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from '../material/material.module';

@NgModule({
  declarations: [
    ActionButtonContainerComponent,
    InfoMessageComponent,
    LoadingWrapperComponent,
    PanelCardComponent,
    SectionTextComponent,
    SpinnerComponent,
    TitleTextComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule
  ]
})
export class UiElementsModule {
}
