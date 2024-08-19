import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryInfo } from '@models/country.interface';
import { Holiday } from '@models/holiday.interface';
import { CountryService } from '@services/country.service';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [DatePipe, CalendarModule, FormsModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
})
export class CountryComponent implements OnInit, OnDestroy {
  country!: CountryInfo | null;
  publicHolidays: Holiday[] = [];
  selectedYear!: Date;
  subscription = new Subscription();

  minDate!: Date;
  maxDate!: Date;

  countryService = inject(CountryService);
  route = inject(ActivatedRoute);

  constructor() {
    this.selectedYear = new Date();
    this.minDate = new Date(2020, 0, 1);
    this.maxDate = new Date(2030, 11, 31);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const countryCode = params.get('code');
      if (countryCode) {
        this.fetchCountryDetails(countryCode);
        this.fetchPublicHolidays(countryCode, this.selectedYear.getFullYear());
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchCountryDetails(code: string): void {
    this.subscription.add(
      this.countryService.getCountryByCode(code).subscribe({
        next: (data: CountryInfo) => {
          this.country = data;
        },
        error: error => {
          console.error('Error fetching country details:', error);
        },
      })
    );
  }

  fetchPublicHolidays(code: string, year: number): void {
    this.subscription.add(
      this.countryService.getPublicHolidays(year, code).subscribe({
        next: (data: Holiday[]) => {
          this.publicHolidays = data;
        },
        error: error => {
          console.error('Error fetching public holidays:', error);
        },
      })
    );
  }

  onYearSelect() {
    const year = this.selectedYear.getFullYear();
    if (this.country) {
      this.fetchPublicHolidays(this.country.countryCode, year);
    }
  }
}
