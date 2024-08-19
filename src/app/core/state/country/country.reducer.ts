import { ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store';
import { addFavorite, removeFavorite } from './country.actions';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Country } from '@models/country.interface';

export interface FavoriteState {
  favoriteCountries: Country[];
}

export const initialState: FavoriteState = {
  favoriteCountries: [],
};

export const favoriteReducer = createReducer(
  initialState,
  on(addFavorite, (state, { country }) => ({
    ...state,
    favoriteCountries: [...state.favoriteCountries, country],
  })),
  on(removeFavorite, (state, { countryCode }) => ({
    ...state,
    favoriteCountries: state.favoriteCountries.filter(
      contact => contact.countryCode !== countryCode
    ),
  }))
);

function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: ['favorites'], rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
];
