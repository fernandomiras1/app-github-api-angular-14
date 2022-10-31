import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { Subject } from "rxjs";
import {
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { GithubUser } from "../interfaces";
import { GithubApi } from "../interfaces";
import { SearchService } from "../search.service";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
})
export class ResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ["avatar", "login", "type"];
  data: GithubUser[] = [];
  valueSearch = "";
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly _unsubscribe$: Subject<string> = new Subject<string>();
  constructor(private readonly searchService: SearchService) {}

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap(() => this.getSearchAPI())
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.searchService.valueSearchChanges$
      .pipe(
        takeUntil(this._unsubscribe$),
        tap((value: string) => (this.valueSearch = value)),
        switchMap(() => this.getSearchAPI())
      )
      .subscribe();
  }

  private getSearchAPI() {
    this.isLoadingResults = true;
    return this.searchService
      .search(this.valueSearch, this.paginator.pageIndex + 1)
      .pipe(
        tap((data) => {
          this.isRateLimitReached = data === null;
          this.resultsLength = data.total_count;
        }),
        map((data: GithubApi) => data?.items || []),
        tap((data) => (this.data = data)),
        finalize(() => (this.isLoadingResults = false)),
        takeUntil(this._unsubscribe$)
      );
  }

  ngOnDestroy(): void {
    this._unsubscribe$.complete();
  }
}
