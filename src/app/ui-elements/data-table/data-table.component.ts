import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort, SortDirection} from '@angular/material';
import {merge, Observable, of, Subscription} from 'rxjs';
import {catchError, delay, exhaustMap, map, startWith} from 'rxjs/operators';
import {PageableResponseParameters} from '../../../models/api/pageable-response-parameters';
import {PageableDataList} from '../../../models/pageble-data-list';
import {UI_BORDER_RADIUS} from '../ui-constants';
import {UiUtility} from '../ui-utility-functions';
import camelCaseToTitleCase = UiUtility.camelCaseToTitleCase;
import scrollToSmooth = UiUtility.scrollToSmooth;
import isObject = UiUtility.isObject;
import unsubscribeMultiple = UiUtility.unsubscribeMultiple;
import isStringNumber = UiUtility.isStringNumber;
import {CRUDStore} from '../../../../core/stores/crud-store/crud-store';

export interface MatTableDataLoad<T> {
    data: T[];
    columnNames: string[];
    columnNameMap?: object; // an object that maps the column names as they appear in the data to a new name
    columnWidthMap?: object; // sets the width of the column
    columnPaddingMap?: object; // sets the padding for each td in a specific column
    currencyColumns?: string[];
    disabledSortColumns?: string[]; // columns to disable sorting on
    metaData?: PageableResponseParameters;
}

export interface MatTableAPILoad<R, T> {
    url: string;
    options: RestOptions;
    defaultSortColumn?: string;
    defaultSortDirection?: 'asc' | 'desc';
    apiResponseHandler: (apiRes: PageableDataList<R>) => MatTableDataLoad<T>;
    entityStore?: CRUDStore<T>;
}

export interface RestOptions {
    headers?: HttpHeaders;
    observe?: 'body';
    params?: HttpParams;
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

export interface ActionButtonOptions<T> {
    label: string;
    icon: any;
    clickAction: (row: T) => void;
}

export enum TableFieldDataType {
    CHECKED_CHECKBOX,
    UNCHECKED_CHECKBOX,
    CURRENCY,
    NULL,
    RAW_VALUE,
    ACTION_OPTIONS
}

export enum TableState {
    VALID = 'VALID',
    ERROR = 'ERROR',
    LOADING = 'LOADING'
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'ui-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss', './../../../../../sass/mat-table-styles.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('collapsed <=> expanded', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class DataTableComponent implements OnDestroy, OnChanges {
    @Input() dataLoad$: Observable<MatTableDataLoad<any>>;
    @Input() apiLoad: MatTableAPILoad<any, any>;
    @Input() checkboxColumn: boolean;
    @Input() radioColumn: boolean;
    @Input() rowNums: boolean;
    @Input() tableName: string;
    @Input() sizes = [10, 25, 50];
    @Input() includeExpandedDropdownContent = false;
    @Input() actionButtonOptions: ActionButtonOptions<any>[] = [];
    @Input() maxWidth = '100%';
    @Input() includeFilter = false;
    @Input() filterLabel = 'Type here to start refining your results';
    @Input() scrollToOnInit = false;
    @Input() keepPageOptions = false;
    @Input() disableClear = true;
    @Output() tableState = new EventEmitter<TableState>();
    @ViewChild(MatPaginator) protected paginator: MatPaginator;
    @ViewChild(MatSort) protected sort: MatSort;
    @ViewChild('tableContainer') protected tableContainerEl: ElementRef;

    helpText = this.getHelpText();
    borderRadius = UI_BORDER_RADIUS;
    protected TableFieldDataType = TableFieldDataType;
    protected dataLoadSubscription: Subscription;
    protected sortSubscription: Subscription;
    protected paginatorSubscription: Subscription;
    protected tableResultsSubscription: Subscription;
    displayedColumns: string[];
    dataSource: MatTableDataSource<any>;
    protected selection = new SelectionModel<any>(true, []);
    protected columnNameMap: object = {};
    protected columnWidthMap: object = {};
    protected columnPaddingMap: object = {};
    protected currencyColumns: string[] = [];
    protected disabledSortColumns: string[] = [];
    protected loading = true;
    protected expandedEntity: any | null;
    resultsLength = 0;
    isLoadingResults = false;
    page = 0;
    size = this.sizes[0];
    sortField: string;
    sortDir: SortDirection;
    protected apiCallError = false;

    constructor(private http: HttpClient, private cd: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (!!changes[propName]) {
                if (propName === 'apiLoad') {
                    this.resetTable();
                    this.afterViewInit();
                }
                if (propName === 'keepPageOptions') {
                    const pageEvent: PageEvent = {
                        pageIndex: this.paginator.pageIndex,
                        previousPageIndex: null,
                        pageSize: this.paginator.pageSize,
                        length: this.paginator.length
                    };
                    this.paginator.page.emit(pageEvent);
                }
            }
        }
    }

    resetTable() {
        if (!!this.apiLoad) {
            try {
                this.sortField = this.apiLoad.defaultSortColumn;
                this.sortDir = this.apiLoad.defaultSortDirection;
                this.sort.sort({
                    id: this.sortField,
                    start: this.sortDir,
                    disableClear: this.disableClear
                });
            } catch (e) {
                console.warn(e);
            }
        }
    }

    afterViewInit() {
        this.ngOnDestroy();
        if (this.checkboxColumn && this.radioColumn) {
            throw new Error('Cannot have radio button column and checkbox column. Please choose one or the other.');
        }
        this.apiLoad ? this.displayTableWithRestCall() : this.displayTableWithProvidedData();
        this.helpText = this.getHelpText();
        this.cd.detectChanges();
    }

    ngOnDestroy(): void {
        const subscriptions = [this.dataLoadSubscription, this.sortSubscription, this.paginatorSubscription];
        unsubscribeMultiple(subscriptions);
    }


    displayTableWithProvidedData() {
        if (!this.dataLoad$) {
            throw new Error('No value given to dataLoad$. You are likely not passing in any data at the time the table is created. ' +
                'To fix, keep the table uncreated using an *ngIf until you have data ready to pass in.');
        }
        this.dataLoadSubscription = this.dataLoad$.subscribe(dataLoad => {
            this.setDataSourceFromDataLoad(dataLoad);
        });
    }

    displayTableWithRestCall() {
        // If the user changes the sort order, reset back to the first page.
        if (!!this.sort && !!this.paginator) {
            const sortChange$ = this.sort.sortChange.asObservable();
            this.sortSubscription = sortChange$.pipe(
                startWith(this.getDefaultSortState()),
                delay(0),
            ).subscribe((sort: object | Sort) => {
                this.setSortState(sort);
            });
            this.paginatorSubscription = this.paginator.page.asObservable().pipe(
                startWith({}),
                delay(0),
            ).subscribe((paginator: MatPaginator) => {
                this.setPaginatorState(paginator);
            });
            this.tableResultsSubscription = merge(sortChange$, this.paginator.page)
                .pipe(
                    startWith({}),
                    delay(0),
                    exhaustMap((val) => {
                        return !this.isLoadingResults ? this.makeApiCallForTableData() : of(null);
                    }),
                    map(data => {
                        if (!data) {
                            return null;
                        }
                        return this.mapApiCallResults(data);
                    }),
                    catchError((error) => {
                        return this.handleApiErrorResponse(error);
                    })
                ).subscribe((dataLoad: MatTableDataLoad<any>) => {
                    if (!!dataLoad) {
                        this.setDataSourceFromDataLoad(dataLoad);
                    } else if (!this.isLoadingResults) {
                        this.setDataSourceFromDataLoad({data: [], columnNames: []});
                    }
                });
        }
    }

    getDefaultSortState(): Sort | object {
        if (this.apiLoad.defaultSortColumn && this.apiLoad.defaultSortDirection) {
            return {active: this.apiLoad.defaultSortColumn, direction: this.apiLoad.defaultSortDirection};
        }
        return {};
    }

    setSortState(sort: object | Sort) {
        const s = sort as Sort;
        if (!!s && s.direction && s.active) {
            this.sortDir = s.direction;
            this.sortField = s.active;
            this.paginator.pageIndex = 0;
        }
    }

    setPaginatorState(paginator: MatPaginator) {
        if (!!paginator && this.size !== paginator.pageSize) {
            this.paginator.pageIndex = 0;
        }
    }

    makeApiCallForTableData(): Observable<any> {
        this.apiCallError = false;
        this.isLoadingResults = true;
        this.page = this.paginator.pageIndex;
        this.size = this.paginator.pageSize;
        this.setSortQueryParams();
        try {
            this.cd.detectChanges();
        } catch (e) {
        }
        this.tableState.emit(TableState.LOADING);
        return this.httpCall();
    }

    httpCall(): Observable<MatTableDataLoad<any>> {
        return !!this.apiLoad ? this.http.get<any>(this.apiLoad.url, !!this.apiLoad.options ? this.apiLoad.options : {}).pipe(
            map((res) => this.apiLoad.apiResponseHandler(res))) : of(null);
    }

    mapApiCallResults(data: MatTableDataLoad<any>): MatTableDataLoad<any> {
        this.resultsLength = data.metaData ? data.metaData.totalElements : null;
        this.isLoadingResults = false;
        this.setEntityStoreData(data.data);
        return data;
    }

    handleApiErrorResponse(error: any): Observable<object> {
        this.apiCallError = true;
        this.isLoadingResults = false;
        console.error(error);
        return of(null);
    }

    setEntityStoreData(data: object[]) {
        if (!!this.apiLoad && !!this.apiLoad.entityStore) {
            this.apiLoad.entityStore.setEntities(data);
        }
    }

    setDataSourceFromDataLoad(dataLoad: MatTableDataLoad<any>) {
        if (dataLoad.data) {
            this.dataSource = dataLoad.data.length > 0 ? new MatTableDataSource(this.getDataloadDataIfDataExists(dataLoad)) : null;
            this.reinitPagingAndSorting();
        }
        this.afterDataLoad();
    }

    getDataloadDataIfDataExists(dataLoad: MatTableDataLoad<any>): any[] {
        let count = dataLoad.metaData ? dataLoad.metaData.page : 1;
        this.initializeVariablesForDataLoad(dataLoad);
        this.addExtraColumns();
        dataLoad.data.forEach(value => {
            value['_id'] = count++;
            value['actions'] = this.actionButtonOptions;
        });
        return dataLoad.data;
    }

    initializeVariablesForDataLoad(dataLoad: MatTableDataLoad<any>) {
        this.displayedColumns = dataLoad.columnNames || [];
        this.currencyColumns = dataLoad.currencyColumns || [];
        this.disabledSortColumns = ['actions', ...dataLoad.disabledSortColumns] || ['actions'];
        this.columnNameMap = dataLoad.columnNameMap || {};
        this.columnWidthMap = dataLoad.columnWidthMap || {};
        this.columnPaddingMap = dataLoad.columnPaddingMap || {};
    }

    addExtraColumns() {
        this.addIdColumn();
        this.addSelectColumn();
        this.addActionButtonsColumn();
    }

    addIdColumn() {
        if (this.rowNums && !this.displayedColumns.includes('_id')) {
            this.displayedColumns.unshift('_id');
            this.columnNameMap ? this.columnNameMap['_id'] = '#' : this.columnNameMap = {'_id': '#'};
        }
    }

    addSelectColumn() {
        if (this.checkboxColumn || this.radioColumn) {
            this.displayedColumns.unshift('select');
        }
    }

    addActionButtonsColumn() {
        if (this.actionButtonOptions.length > 0 && !this.displayedColumns.includes('_actions')) {
            this.columnNameMap ? this.columnNameMap['_actions'] = 'Actions' : this.columnNameMap = {'_actions': 'Actions'};
            this.displayedColumns.push('actions');
        }
    }

    reinitPagingAndSorting() {
        if (!this.apiLoad) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    afterDataLoad() {
        this.apiCallError ? this.tableState.emit(TableState.ERROR) : this.tableState.emit(TableState.VALID);
        this.loading = false;
        this.isLoadingResults = false;
        this.cd.detectChanges();
        if (this.scrollToOnInit) {
            scrollToSmooth(this.tableContainerEl);
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    setSortQueryParams() {
        if (this.apiLoad) {
            const paramObject = {};
            if (this.apiLoad.options && this.apiLoad.options.params) {
                this.apiLoad.options.params.keys().forEach(key => {
                    if (key !== 'page' && key !== 'size' && key !== 'sort') {
                        paramObject[key] = this.apiLoad.options.params.get(key);
                    }
                });
            }
            paramObject['page'] = this.page.toString();
            paramObject['size'] = this.size.toString();
            if (this.sortField && this.sortDir) {
                paramObject['sort'] = `${this.sortField},${this.sortDir}`;
            }
            this.apiLoad.options.params = new HttpParams({fromObject: paramObject});
        }
    }

    toggleRadio(row: any) {
        this.selection.clear();
        this.selection.select(row);
    }

    showNoMatchFound() {
        return (!this.dataSource || !this.dataSource.data || this.dataSource.data.length === 0);
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    displayColumnTitle(fieldName: string) {
        return (this.columnNameMap && this.columnNameMap[fieldName]) ? this.columnNameMap[fieldName] : camelCaseToTitleCase(fieldName);
    }

    isColumnCurrency(column: string): boolean {
        return this.currencyColumns.includes(column);
    }

    isColumnSortDisabled(column: string) {
        return this.disabledSortColumns.includes(column);
    }

    tableFieldMapper(entity: any, column: string): TableFieldDataType {
        const rawValue = entity[column];
        if ((!!rawValue || rawValue === false) && !isStringNumber(rawValue)) {
            const s = (!!rawValue || rawValue === false) ? rawValue.toString().toUpperCase() : null;
            if (s === 'Y' || s === 'T' || s === 'TRUE') {
                return TableFieldDataType.CHECKED_CHECKBOX;
            } else if (s === 'N' || s === 'F' || s === 'FALSE') {
                return TableFieldDataType.UNCHECKED_CHECKBOX;
            } else if (!!rawValue && isObject(rawValue)) {
                return TableFieldDataType.ACTION_OPTIONS;
            }
        } else if (!rawValue && rawValue !== 0) {
            return TableFieldDataType.NULL;
        } else if (this.isColumnCurrency(column)) {
            return TableFieldDataType.CURRENCY;
        }
        return TableFieldDataType.RAW_VALUE;
    }

    getHelpText() {
        const filterInfo = this.includeFilter ? 'Type text in the filter to filter your results. ' : '';
        const pagingAndSortingInfo = 'Click the column headers to sort. Change the "Items per page" dropdown underneath the results to view more results. ' +
            'Click the arrows to navigate between pages of results. ';
        const apiInfo = !!this.apiLoad ? 'Sorting will reset the page number to 1. ' : '';
        return `${filterInfo} ${pagingAndSortingInfo} ${apiInfo}`;
    }
}

