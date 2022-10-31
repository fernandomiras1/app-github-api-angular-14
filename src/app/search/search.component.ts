import { SearchService } from "./../search.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { startWith } from "rxjs/operators";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly searchService: SearchService
  ) {
    this.form = this.fb.group({
      searchValue: "",
    });
  }

  ngOnInit(): void {
    this.form
      .get("searchValue")
      ?.valueChanges.pipe(
        startWith(""),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.searchService.valueSearchChanges$.next(value);
      });
  }
}
