import dayjs from 'dayjs';

export const SortType = {
  DAY: 'day-down',
  TIME: 'time-down',
  PRICE: 'price-down',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
  FAVORITES: 'favorites',
};

export const MenuItem = {
  ADD_NEW_POINT: 'add_new_point',
  TABLE: 'table',
  STATS: 'stats',
};

export const OFFER_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const BLANK_POINT = {
  basePrice : 0,
  dateFrom : dayjs(),
  dateTo : dayjs(),
  destination : [],
  isFavorite : false,
  offers : [],
  type :'taxi',
};
