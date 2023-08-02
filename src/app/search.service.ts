import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, ReplaySubject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { GithubApi, GithubUser } from "./interfaces";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  valueSearchChanges$ = new ReplaySubject<string>(1);

  constructor(private readonly http: HttpClient) {}

  search(value: string, pageNumber = 1): Observable<GithubApi> {
    return this.http
      .get<GithubApi>(`${environment.apiUrl}/search/users?q=${value}`, {
        params: this.getHttpParams(String(pageNumber)),
      })
      .pipe(
        map((res: GithubApi) => this.parseData(res)),
        catchError(() => of({ items: [], total_count: 0 }))
      );
  }

  private parseData(item: GithubApi): GithubApi {
    const items: GithubUser[] = item.items.map(
      ({ avatar_url, login, type }) => ({ avatar_url, login, type })
    );
    return {
      total_count: item.total_count,
      items,
    };
  }

  private getHttpParams(pageNumber: string): HttpParams {
    return new HttpParams().set("per_page", "9").set("page", pageNumber);
  }
}
