import { HttpParams } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { of, ReplaySubject } from "rxjs";
import { GithubApi } from "./interfaces";

import { SearchService } from "./search.service";

export const searchServiceStub = {
  valueSearchChanges$: new ReplaySubject<string>(1),
  search: function (value: string, pageNumber = 1) {
    return of<GithubApi>({
      total_count: 1,
      items: [{
        avatar_url: 'mock__avatar_url',
        login: 'mock__login',
        type: 'mock__type'
      }],
    });
  }
}

describe("SearchService", () => {
  let service: SearchService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SearchService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch github users", () => {
    const expectedResult = {
      total_count: 1,
      items: [
        {
          avatar_url: "https://avatars.githubusercontent.com/u/4753511?v=4",
          login: "e",
          type: "User",
        },
      ],
    };
    service.search("johndoe").subscribe((result) => {
      expect(result).toEqual(expectedResult);
    });
    const req = httpTestingController.expectOne(
      "https://api.github.com/search/users?q=johndoe in:login&per_page=9&page=1"
    );
    expect(req.request.method).toEqual("GET");
    req.flush(expectedResult);
  });

  describe("parseData", () => {
    it("should extract object properties from github item api response object", () => {
      const arg = {
        total_count: 1,
        items: [{
          avatar_url: 'mock_url',
          login: 'mock_login',
          type: 'mock_type',
          mockProp1: 'mockProp1',
          mockProp2: 'mockProp2',
          mockProp3: 'mockProp3',
        }],
      }
      const result = (service as any).parseData(arg);
      const expectedResult: GithubApi = {
        total_count: 1,
        items: [{
          avatar_url: 'mock_url',
          login: 'mock_login',
          type: 'mock_type'
        }],
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getHttpParams', () => {
    it('should return correct http params', () => {
      const expectedResult = new HttpParams().set("per_page", "9").set("page", 1);
      const actualResult = (service as any).getHttpParams(1);
      expect(actualResult).toEqual(expectedResult);
    });
  });
});
