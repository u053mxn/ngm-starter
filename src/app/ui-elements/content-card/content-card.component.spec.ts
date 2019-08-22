import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContentCardComponent} from './content-card.component';
import {MatCardModule, MatProgressBarModule, MatProgressSpinnerModule, MatTooltipModule} from '@angular/material';
import {SectionHeaderComponent} from '../section-header/section-header.component';
import {SectionTextComponent} from '../section-text/section-text.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';
import {FaIconCircleComponent} from '../fa-icon-circle/fa-icon-circle.component';
import {SpinnerComponent} from '../spinner/spinner.component';

describe('ContentCardComponent', () => {
    let component: ContentCardComponent;
    let fixture: ComponentFixture<ContentCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatProgressBarModule, MatCardModule, FontAwesomeModule, MatTooltipModule, RouterModule, MatProgressSpinnerModule],
            declarations: [ContentCardComponent, SectionHeaderComponent, SectionTextComponent, FaIconCircleComponent, SpinnerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
