import { Country } from '@models/country.interface';
import { createAction, props } from '@ngrx/store';

export const addFavorite = createAction(
  '[[Home Page Component] Add To Favorite',
  props<{
    country: Country;
  }>()
);

export const removeFavorite = createAction(
  '[Home Page Component] Remove From Favorite',
  props<{ countryCode: string }>()
);
