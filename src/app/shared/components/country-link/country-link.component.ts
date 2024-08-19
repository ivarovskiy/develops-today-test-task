import { Component, Input } from '@angular/core';
import { Country } from '@models/country.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-country-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './country-link.component.html',
  styleUrl: './country-link.component.scss',
})
export class CountryLinkComponent {
  @Input() country!: Country;
}
