import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, SortDirection} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {merge, Observable, of} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {catchError, delay, map, startWith, switchMap} from 'rxjs/operators';
import {PaginatedResponseMetadata} from '../../../state/models/user/user.response.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

export interface MatTableDataLoad<T> {
  data?: T[];
  columnNames?: string[];
  columnNameMap?: object; // an object that maps the column names as they appear in the data to a new name
  metaData?: PaginatedResponseMetadata;
}

export interface MatTableAPILoad<R, T> {
  url: string;
  options: RestOptions;
  apiResponseHandler: (apiRes: R) => MatTableDataLoad<T>;
}

export interface RestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Component({
  selector: 'ui-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataTableComponent implements AfterViewInit {
  @Input() dataLoad$: Observable<MatTableDataLoad<any>>;
  @Input() apiLoad: MatTableAPILoad<any, any>;
  @Input() selectColumn: boolean;
  @Input() rowNums: boolean;
  @Input() tableName: string;
  @Input() titleLightTheme = false;
  @Input() filterLightTheme = false;
  @Input() tableLightTheme = false;

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  columnNameMap: object = {};
  loading = true;

  expandedEntity: any | null;

  resultsLength = 0;
  isLoadingResults = !!this.apiLoad;

  page = 0;
  sizes = [5, 10, 30, 50];
  size = this.sizes[0];

  sortField;
  sortDir: SortDirection;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit() {
    if (this.apiLoad) {
      this.displayTableWithRestCall();
    } else {
      this.displayTableWithProvidedData();
    }
  }

  displayTableWithProvidedData() {
    this.dataLoad$.subscribe(dataLoad => {
      this.setDataSourceFromDataLoad(dataLoad);
    });
  }

  displayTableWithRestCall() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(
      startWith(null),
      delay(0),
    ).subscribe((val: MatSort) => {
      if (!!val) {
        this.sortDir = val.direction;
        this.sortField = val.active;
        this.paginator.pageIndex = 0;
      }
    });
    this.paginator.page.pipe(
      startWith(null),
      delay(0),
    ).subscribe((val: MatPaginator) => {
      if (!!val && this.size !== val.pageSize) {
        this.paginator.pageIndex = 0;
      }
    });
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        delay(0),
        switchMap(() => {
          this.isLoadingResults = true;
          this.page = this.paginator.pageIndex;
          this.size = this.paginator.pageSize;
          this.setSortQueryParams();
          return this.http.get<any>(this.apiLoad.url, this.apiLoad.options).pipe(
            map((res) => this.apiLoad.apiResponseHandler(res)));
        }),
        map(data => {
          this.resultsLength = data.metaData.totalResults;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of({});
        })
      ).subscribe((dataLoad: MatTableDataLoad<any>) => {
      this.setDataSourceFromDataLoad(dataLoad);
    });
  }

  setDataSourceFromDataLoad(dataLoad: MatTableDataLoad<any>) {
    if (dataLoad.data && dataLoad.data.length > 0) {
      let count = dataLoad.metaData ? dataLoad.metaData.start : 1;
      this.displayedColumns = [];
      this.columnNameMap = {};
      this.displayedColumns = dataLoad.columnNames;
      this.columnNameMap = dataLoad.columnNameMap;
      if (this.rowNums && !this.displayedColumns.includes('_id')) {
        this.displayedColumns.unshift('_id');
        this.columnNameMap ? this.columnNameMap['_id'] = '#' : this.columnNameMap = {'_id': '#'};
      }
      if (this.selectColumn) {
        this.displayedColumns.unshift('select');
      }
      dataLoad.data.forEach(value => value['_id'] = count++);
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(dataLoad.data);
      if (!this.apiLoad) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      this.loading = false;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setSortQueryParams() {
    const paramObject = {};
    this.apiLoad.options.params.keys().forEach(key => {
      if (key !== 'page' && key !== 'size' && key !== 'sort') {
        paramObject[key] = this.apiLoad.options.params.get(key);
      }
    });
    paramObject['page'] = this.page.toString();
    paramObject['size'] = this.size.toString();
    if (this.sortField && this.sortDir) {
      paramObject['sort'] = `${this.sortField},${this.sortDir}`;
    }
    this.apiLoad.options.params = new HttpParams({fromObject: paramObject});
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
    if (this.columnNameMap && this.columnNameMap[fieldName]) {
      return this.columnNameMap[fieldName];
    } else {
      return this.camelCaseToTitleCase(fieldName);
    }
  }

  isString(val: any) {
    return typeof val === 'string';
  }

  isNumber(val: any) {
    return typeof val === 'number';
  }

  camelCaseToTitleCase(camelCase) {
    if (camelCase == null || camelCase === '') {
      return camelCase;
    }

    camelCase = camelCase.trim();
    let newText = '';
    for (let i = 0; i < camelCase.length; i++) {
      if (/[A-Z]/.test(camelCase[i])
        && i !== 0
        && /[a-z]/.test(camelCase[i - 1])) {
        newText += ' ';
      }
      if (i === 0 && /[a-z]/.test(camelCase[i])) {
        newText += camelCase[i].toUpperCase();
      } else {
        newText += camelCase[i];
      }
    }

    return newText;
  }
}

