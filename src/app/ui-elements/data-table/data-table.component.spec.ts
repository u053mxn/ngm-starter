import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faInfo} from '@fortawesome/free-solid-svg-icons';
import {Observable, of, Subscription} from 'rxjs';
import {UiElementsModule} from '../ui-elements.module';
import {DataTableComponent, MatTableAPILoad, MatTableDataLoad, TableFieldDataType, TableState} from './data-table.component';
import {configureTestSuite} from 'ng-bullet';
import {timeout} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import Spy = jasmine.Spy;
import {By} from '@angular/platform-browser';


@Component({
    selector: 'test-cmp',
    template: `
        <ui-data-table [dataLoad$]="dataLoad$" [apiLoad]="apiLoad" [includeFilter]="includeFilter"></ui-data-table>`,
})
class TestWrapperComponent {
    @ViewChild(DataTableComponent) dataTableComponent: DataTableComponent;
    dataLoad$: Observable<MatTableDataLoad<any>>;
    apiLoad: MatTableAPILoad<any, any>;
    includeFilter = false;
}


describe('DataTableComponent', () => {
    let component: TestWrapperComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;
    let de: DebugElement;
    let makeApiCallSpy: Spy;
    let subscription: Subscription;

    const DATA_LOAD: Observable<MatTableDataLoad<any>> = of({
        data: [{field: 1}, {field: 2}, {field: 3}],
        columnNames: ['Col 1', 'Col 2', 'Col 3']
    });

    const API_LOAD: MatTableAPILoad<any, any> = {
        url: '/test/url',
        options: {},
        apiResponseHandler: (apiRes) => {
            return {
                data: [{test: '1'}],
                columnNames: ['test']
            };
        }
    };

    configureTestSuite((() => {
        TestBed.configureTestingModule({
            declarations: [TestWrapperComponent],
            imports: [
                UiElementsModule,
                HttpClientTestingModule,
                BrowserAnimationsModule
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestWrapperComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        component.apiLoad = API_LOAD;
        makeApiCallSpy = spyOn(component.dataTableComponent, 'makeApiCallForTableData');
        makeApiCallSpy.and.returnValue(of(API_LOAD.apiResponseHandler({content: []}))).and.callThrough();
        fixture.detectChanges();
    });

    afterEach(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });

    beforeAll(() => {
        library.add(faInfo);
    });

    it('should create with data load passed in', () => {
        component.dataLoad$ = DATA_LOAD;
        component.apiLoad = null;
        fixture.detectChanges();
        expect(component.dataTableComponent).toBeTruthy();
    });

    it('should create with api load passed in', () => {
        fixture.detectChanges();
        expect(component.dataTableComponent).toBeTruthy();
    });

    it('should generate basic help text if nothing extra provided', () => {
        component.dataLoad$ = DATA_LOAD;
        component.apiLoad = null;
        fixture.detectChanges();
        component.dataTableComponent.afterViewInit();
        const simpleMessage = ' Click the column headers to sort. Change the "Items per page" dropdown underneath the results to view more results. ' +
            'Click the arrows to navigate between pages of results.  ';
        expect(component.dataTableComponent.helpText).toBe(simpleMessage);
    });

    it('should generate help text with filter info if filter included', () => {
        component.dataLoad$ = DATA_LOAD;
        component.apiLoad = null;
        const filterMessage = 'Type text in the filter to filter your results. ';
        const simpleMessage = 'Click the column headers to sort. Change the "Items per page" dropdown underneath the results to view more results. ' +
            'Click the arrows to navigate between pages of results.  ';
        const fullMessage = `${filterMessage} ${simpleMessage}`;
        component.includeFilter = true;
        fixture.detectChanges();
        component.dataTableComponent.afterViewInit();
        expect(component.dataTableComponent.helpText).toBe(fullMessage);
    });
    it('should generate help text with filter info if filter included', () => {
        component.includeFilter = true;
        const filterMessage = 'Type text in the filter to filter your results. ';
        const simpleMessage = 'Click the column headers to sort. Change the "Items per page" dropdown underneath the results to view more results. ' +
            'Click the arrows to navigate between pages of results. ';
        const sortingMessage = 'Sorting will reset the page number to 1. ';
        const fullMessage = `${filterMessage} ${simpleMessage} ${sortingMessage}`;
        fixture.detectChanges();
        component.dataTableComponent.afterViewInit();
        expect(component.dataTableComponent.helpText).toBe(fullMessage);
    });


    it('should throw error if no apiLoad or dataLoad', () => {
        component.apiLoad = null;
        let error = false;
        const errorMessage = 'No value given to dataLoad$. You are likely not passing in any data at the time the table is created. ' +
            'To fix, keep the table uncreated using an *ngIf until you have data ready to pass in.';
        try {
            fixture.detectChanges();
            component.dataTableComponent.displayTableWithProvidedData();
        } catch (e) {
            error = true;
            expect(e.message).toBe(errorMessage);
        }
        expect(error).toBeTruthy();
    });

    it('should set data source if data load passed in and api load is falsy', () => {
        component.dataLoad$ = DATA_LOAD;
        component.apiLoad = null;
        fixture.detectChanges();
        spyOn(component.dataTableComponent, 'setDataSourceFromDataLoad');
        component.dataTableComponent.displayTableWithProvidedData();
        expect(component.dataTableComponent.setDataSourceFromDataLoad).toHaveBeenCalled();
    });

    it('should display table with rest call if api load passed in', () => {
        spyOn(component.dataTableComponent, 'displayTableWithRestCall');
        fixture.detectChanges();
        component.dataTableComponent.afterViewInit();
        expect(component.dataTableComponent.displayTableWithRestCall).toHaveBeenCalled();
    });

    it('should call displayTableWithRestCall if api load passed in', (done) => {
        makeApiCallSpy.and.returnValue(of(API_LOAD.apiResponseHandler({content: []})));
        spyOn(component.dataTableComponent, 'displayTableWithRestCall');
        subscription = component.dataTableComponent.tableState.pipe(timeout(5000)).subscribe(state => {
            if (state === TableState.VALID) {
                expect(component.dataTableComponent.displayTableWithRestCall).toHaveBeenCalled();
                done();
            }
        });
        component.dataTableComponent.afterViewInit();
    });

    it('should set data source to empty arrays if api call returns falsy value', (done) => {
        makeApiCallSpy.and.returnValue(of(null));
        fixture.detectChanges();
        subscription = component.dataTableComponent.tableState.pipe(timeout(5000)).subscribe(state => {
            expect(state).not.toBe(TableState.ERROR);
            if (state === TableState.VALID) {
                expect(component.dataTableComponent.dataSource).toBe(null);
                fixture.detectChanges();
                const paginator = de.query(By.css('.no-results-message'));
                expect(paginator).toBeTruthy();
                done();
            }
        });
        component.dataTableComponent.afterViewInit();
    });

    it('should set data source to empty arrays if api call errors', (done) => {
        makeApiCallSpy.and.throwError('Error');
        fixture.detectChanges();
        subscription = component.dataTableComponent.tableState.pipe(timeout(5000)).subscribe(state => {
            expect(state).not.toBe(TableState.VALID);
            if (state === TableState.ERROR) {
                expect(component.dataTableComponent.dataSource).toBe(null);
                fixture.detectChanges();
                const paginator = de.query(By.css('.no-results-message'));
                expect(paginator).toBeTruthy();
                done();
            }
        });
        component.dataTableComponent.afterViewInit();
    });

    it('should set data source to data arrays if api call returns data', (done) => {
        makeApiCallSpy.and.returnValue(of(API_LOAD.apiResponseHandler({content: []})));
        subscription = component.dataTableComponent.tableState.pipe(timeout(5000)).subscribe(state => {
            expect(state).not.toBe(TableState.ERROR);
            if (state === TableState.VALID) {
                expect(component.dataTableComponent.dataSource.data.length).toBe(1);
                expect(component.dataTableComponent.dataSource.data[0]['test']).toBe('1');
                fixture.detectChanges();
                const paginator = de.query(By.css('.no-results-message'));
                expect(paginator).toBeFalsy();
                done();
            }
        });
        component.dataTableComponent.afterViewInit();
    });

    it('should call method to setup query params before making api call', (done) => {
        const setSortParamsSpy = spyOn(component.dataTableComponent, 'setSortQueryParams');
        subscription = component.dataTableComponent.tableState.pipe(timeout(5000)).subscribe(state => {
            expect(state).not.toBe(TableState.ERROR);
            if (state === TableState.LOADING) {
                expect(setSortParamsSpy).toHaveBeenCalled();
                done();
            }
        });
        component.dataTableComponent.makeApiCallForTableData();
    });

    it('should set page and size query params and include passed in params', () => {
        const page = 2;
        const size = 25;
        component.dataTableComponent.apiLoad.options.params = new HttpParams({fromObject: {name: 'name', city: 'city', job: 'job'}});
        component.dataTableComponent.page = page;
        component.dataTableComponent.size = size;
        component.dataTableComponent.setSortQueryParams();
        expect(component.dataTableComponent.apiLoad.options.params.get('name')).toBe('name');
        expect(component.dataTableComponent.apiLoad.options.params.get('city')).toBe('city');
        expect(component.dataTableComponent.apiLoad.options.params.get('job')).toBe('job');
        expect(component.dataTableComponent.apiLoad.options.params.get('page')).toBe(page.toString());
        expect(component.dataTableComponent.apiLoad.options.params.get('size')).toBe(size.toString());
    });

    it('should set page, size, and sort query params and include passed in params', () => {
        const page = 2;
        const size = 25;
        const sortField = 'date';
        const sortDir = 'asc';
        component.dataTableComponent.apiLoad.options.params = new HttpParams({fromObject: {name: 'name', city: 'city', job: 'job'}});
        component.dataTableComponent.page = page;
        component.dataTableComponent.size = size;
        component.dataTableComponent.sortField = sortField;
        component.dataTableComponent.sortDir = sortDir;

        component.dataTableComponent.setSortQueryParams();

        expect(component.dataTableComponent.apiLoad.options.params.get('name')).toBe('name');
        expect(component.dataTableComponent.apiLoad.options.params.get('city')).toBe('city');
        expect(component.dataTableComponent.apiLoad.options.params.get('job')).toBe('job');
        expect(component.dataTableComponent.apiLoad.options.params.get('page')).toBe(page.toString());
        expect(component.dataTableComponent.apiLoad.options.params.get('size')).toBe(size.toString());
        expect(component.dataTableComponent.apiLoad.options.params.get('sort')).toBe(`${sortField},${sortDir}`);
    });

    it('should map Y or T field to checked checkbox', () => {
        const column = 'c1';

        let entity: {'c1': any} = {'c1': 'Y'};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.CHECKED_CHECKBOX);

        entity = {'c1': 'T'};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.CHECKED_CHECKBOX);

        entity = {'c1': true};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.CHECKED_CHECKBOX);
    });

    it('should map N, F, or false field to unchecked checkbox', () => {
        const column = 'c1';

        let entity: {'c1': any} = {'c1': 'N'};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.UNCHECKED_CHECKBOX);

        entity = {'c1': 'F'};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.UNCHECKED_CHECKBOX);

        entity = {'c1': false};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.UNCHECKED_CHECKBOX);
    });

    it('should map field that is in currency array to currency', () => {
        spyOn(component.dataTableComponent, 'isColumnCurrency').and.returnValue(true);
        const column = 'c1';
        const entity = {'c1': '100.10'};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.CURRENCY);
    });

    it('should map falsy field besides 0 to null', () => {
        const column = 'c1';

        let entity = {'c1': null};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.NULL);

        entity = {'c1': undefined};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.NULL);
    });

    it('should map 0 field to Raw Value', () => {
        const column = 'c1';
        const entity = {'c1': 0};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.RAW_VALUE);
    });

    it('should map number field to Raw Value if not currency column', () => {
        const column = 'c1';
        const entity = {'c1': 18.5};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.RAW_VALUE);
    });

    it('should map number string field to Raw Value if not currency column', () => {
        const column = 'c1';
        const entity = {'c1': '18.5'};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.RAW_VALUE);
    });

    it('should map object to action object', () => {
        const column = 'c1';
        const entity = {'c1': {action: 'open'}};
        expect(component.dataTableComponent.tableFieldMapper(entity, column)).toBe(TableFieldDataType.ACTION_OPTIONS);
    });
});
