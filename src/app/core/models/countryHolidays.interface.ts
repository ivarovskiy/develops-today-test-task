import { Country } from './country.interface';
import { NextPublicHoliday } from './nextPublicHoliday.interface';

export interface CountryHolidays {
  country: Country;
  holidays: NextPublicHoliday[];
}
