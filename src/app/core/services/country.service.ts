import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, CountryInfo } from '@models/country.interface';
import { CountryHolidays } from '@models/countryHolidays.interface';
import { Holiday } from '@models/holiday.interface';
import { NextPublicHoliday } from '@models/nextPublicHoliday.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly localStorageCountriesKey = 'countries';
  private readonly localStorageHolidaysPrefix = 'holidays_';

  private countries = new BehaviorSubject<Country[]>(
    this.loadFromLocalStorage(this.localStorageCountriesKey) || []
  );
  private randomCountries = new BehaviorSubject<CountryHolidays[]>([]);

  constructor(private http: HttpClient) {
    if (this.countries.getValue().length === 0) {
      this.loadCountriesFromAPI();
    }
  }

  get countries$(): Observable<Country[]> {
    return this.countries.asObservable();
  }

  get randomCountries$(): Observable<CountryHolidays[]> {
    return this.randomCountries.asObservable();
  }

  getRandomCountriesHolidays(): Observable<CountryHolidays[]> {
    return this.randomCountries$;
  }

  setRandomCountryHolidays(countryHolidays: CountryHolidays[]): void {
    this.randomCountries.next(countryHolidays);
  }

  getCountries(): Observable<Country[]> {
    if (this.countries.getValue().length === 0) {
      this.loadCountriesFromAPI();
    }
    return this.countries$;
  }

  getCountryByCode(countryCode: string): Observable<CountryInfo> {
    return this.http.get<CountryInfo>(`/CountryInfo/${countryCode}`);
  }

  getNextHolidays(countryCode: string): Observable<NextPublicHoliday[]> {
    const cachedHolidays = this.loadFromLocalStorage(
      `${this.localStorageHolidaysPrefix}${countryCode}`
    );
    if (cachedHolidays) {
      return of(cachedHolidays);
    }

    return this.http
      .get<NextPublicHoliday[]>(`/NextPublicHolidays/${countryCode}`)
      .pipe(
        tap(data =>
          this.saveToLocalStorage(
            `${this.localStorageHolidaysPrefix}${countryCode}`,
            data
          )
        ),
        catchError(error => {
          console.error(`Error fetching holidays for ${countryCode}:`, error);
          return of([] as NextPublicHoliday[]);
        })
      );
  }

  getPublicHolidays(year: number, countryCode: string): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`/PublicHolidays/${year}/${countryCode}`);
  }

  private loadCountriesFromAPI(): void {
    this.http.get<Country[]>(`/AvailableCountries`).subscribe(
      data => {
        this.countries.next(data);
        this.saveToLocalStorage(this.localStorageCountriesKey, data);
      },
      error => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  private loadFromLocalStorage(key: string): any {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  }

  private saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
