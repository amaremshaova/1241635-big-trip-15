import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FAVORITES]: 'There are no favorite events now',
};

const createNoPointTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];
  return (`<p class="trip-events__msg">${noPointTextValue}</p>`);
};

export default class NoPoint extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoPointTemplate(this._data);
  }
}
