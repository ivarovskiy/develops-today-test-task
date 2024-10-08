import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CountryService } from '@services/country.service';
import { SearchComponent } from './components/search/search.component';
import { Country } from '@models/country.interface';
import { NextPublicHoliday } from '@models/nextPublicHoliday.interface';
import { WidgetComponent } from './components/widget/widget.component';
import { LetterComponent } from '@components/letter/letter.component';
import { PaginatorModule } from 'primeng/paginator';
import { CountryLinkComponent } from '@components/country-link/country-link.component';
import { CountryHolidays } from '@models/countryHolidays.interface';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    SearchComponent,
    WidgetComponent,
    LetterComponent,
    PaginatorModule,
    CountryLinkComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private countryService = inject(CountryService);

  private subscription = new Subscription();

  countries: Country[] = [];
  randomSortedCountries: Country[] = [];
  displayedCountries: Country[] = [];
  randomCountries: CountryHolidays[] = [];
  alphabet: string[] = [];
  selectedLetter = 'ALL';
  totalRecords: number = 0;

  ngOnInit(): void {
    this.subscription.add(
      this.countryService
        .getCountries()
        .pipe(
          tap(data => (this.countries = this.processCountries(data))),
          tap(() => (this.displayedCountries = this.countries.slice(0, 10))),
          switchMap(() => this.loadRandomCountries()),
          catchError(error => {
            console.error('Error loading countries:', error);
            return of([]);
          })
        )
        .subscribe()
    );

    this.alphabet = this.generateAlphabet();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processCountries(data: Country[]): Country[] {
    const groupedContacts = data
      .filter(country => country.name.toLowerCase() !== 'russia')
      .reduce(
        (acc, country) => {
          const firstLetter = country.name.charAt(0).toUpperCase();
          acc[firstLetter] = acc[firstLetter] || [];
          acc[firstLetter].push(country);
          return acc;
        },
        {} as Record<string, Country[]>
      );

    return Object.keys(groupedContacts)
      .sort((a, b) => a.localeCompare(b))
      .flatMap(key => groupedContacts[key]);
  }

  private loadRandomCountries() {
    this.randomSortedCountries = [...this.countries];

    const selectedCountries = this.randomSortedCountries
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const holidayRequests = selectedCountries.map(country =>
      this.countryService
        .getNextHolidays(country.countryCode)
        .pipe(map(holidays => ({ country, holidays })))
    );

    return forkJoin(holidayRequests).pipe(
      tap(randomCountries => {
        this.randomCountries = randomCountries;
        this.countryService.setRandomCountryHolidays(this.randomCountries);
      }),
      catchError(error => {
        console.error('Error loading random country holidays:', error);
        return of([]);
      })
    );
  }

  selectedCountry(country: Country): void {
    this.router.navigate(['/country', country.countryCode]);
  }

  clearFilter(): void {
    this.selectedLetter = 'ALL';
    this.filterCountriesByLetter('ALL');
  }

  private generateAlphabet(): string[] {
    return [...Array(26).keys()]
      .map(i => String.fromCharCode(65 + i))
      .concat('ALL');
  }

  onSelectLetter(letter: string): void {
    this.selectedLetter = letter;
    this.filterCountriesByLetter(letter);
  }

  onPageChange(event: any): void {
    const { first, rows } = event;
    const countriesToDisplay =
      this.selectedLetter === 'ALL'
        ? this.countries
        : this.countries.filter(country =>
            country.name.startsWith(this.selectedLetter)
          );

    this.displayedCountries = countriesToDisplay.slice(first, first + rows);
    this.totalRecords = countriesToDisplay.length;
  }

  private filterCountriesByLetter(letter: string): void {
    this.selectedLetter = letter;
    const countriesToDisplay =
      letter === 'ALL'
        ? this.countries
        : this.countries.filter(country => country.name.startsWith(letter));

    this.displayedCountries = countriesToDisplay.slice(0, 10);
    this.totalRecords = countriesToDisplay.length;
  }
}
