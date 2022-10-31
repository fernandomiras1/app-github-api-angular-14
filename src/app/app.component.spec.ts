import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ResultsComponent } from './results/results.component';
import { SearchComponent } from './search/search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from './material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, SearchComponent, ResultsComponent],
      imports: [HttpClientTestingModule, MaterialModule, ReactiveFormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should render app-search component`, () => {
    const appSearch = fixture.debugElement.query(By.css('app-search'));
    expect(appSearch).toBeTruthy();
  });

  it(`should render app-results component`, () => {
    const appResults = fixture.debugElement.query(By.css('app-results'));
    expect(appResults).toBeTruthy();
  });
});
