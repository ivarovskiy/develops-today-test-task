import { createSelector } from '@ngrx/store';
import { FavoriteState } from './country.reducer';
import { AppState } from '@state/app.state';

export const selectFavoriteCountries = (state: AppState) => state.favorites;

export const selectAllFavoriteCountries = createSelector(
  selectFavoriteCountries,
  (state: FavoriteState) => state.favoriteCountries
);
