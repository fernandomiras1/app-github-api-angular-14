import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { tap, map } from "rxjs/operators";
import { environment } from "../environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${environment.TOKEN_GIT_HUB}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return next
      .handle(authReq)
      .pipe(tap((event) => console.log("RESPONSE DATA: ", event)));
  }
}
