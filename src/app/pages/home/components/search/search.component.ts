import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { Country } from '@models/country.interface';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, AutoCompleteModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input() countries!: Country[];
  @Output() handleSelectedCountry = new EventEmitter<Country>();

  selectedCountry!: Country;
  filteredCountries!: Country[];

  filterCountry(event: AutoCompleteCompleteEvent) {
    const filtered: Country[] = [];
    const query = event.query;

    for (let i = 0; i < (this.countries as Country[]).length; i++) {
      const country = (this.countries as Country[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

  onCountrySelect() {
    this.handleSelectedCountry.emit(this.selectedCountry);
  }
}
