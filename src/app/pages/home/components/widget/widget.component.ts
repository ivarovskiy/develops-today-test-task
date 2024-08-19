import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { CommonModule } from '@angular/common';
import { CountryHolidays } from '@models/countryHolidays.interface';
import { CountryService } from '@services/country.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [
    OverlayPanelModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    InputTextModule,
    ChipsModule,
    CommonModule,
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
})
export class WidgetComponent implements OnInit, OnDestroy {
  randomCountries!: CountryHolidays[];
  countryService = inject(CountryService);
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription = this.countryService
      .getRandomCountriesHolidays()
      .subscribe({
        next: data => (this.randomCountries = data),
        error: error => console.error('Error:', error),
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
