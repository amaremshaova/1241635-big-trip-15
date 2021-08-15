import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createCostTemplate} from './view/cost-trip.js';
import {createInfoTemplate} from './view/info-trip.js';
import {createCreationFormTemplate} from './view/creation-form.js';
import {createPointTemplate} from './view/point-trip';
import {createEditingFormTemplate} from './view/editing-form.js';


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerMainElement = document.querySelector('.trip-main');
const headerNavigationElement = headerMainElement.querySelector('.trip-controls__navigation');
const headerFiltersElement = headerMainElement.querySelector('.trip-controls__filters');
const mainEventsElement = document.querySelector('.trip-events');

const createListData = () => {
  const listDataElement = document.createElement('ul');
  listDataElement.classList.add('trip-events__list');
  mainEventsElement.insertAdjacentElement('beforeend', listDataElement);
  render(listDataElement, createCreationFormTemplate(), 'beforeend');
  render(listDataElement, createEditingFormTemplate(), 'beforeend');

  render(listDataElement, createPointTemplate(), 'beforeend');
  render(listDataElement, createPointTemplate(), 'beforeend');
  render(listDataElement, createPointTemplate(), 'beforeend');
};

const createInfoData = () => {
  const infoSectionElement = document.createElement('section');
  infoSectionElement.classList.add('trip-main__trip-info',  'trip-info');
  render(infoSectionElement, createInfoTemplate(), 'beforeend');
  render(infoSectionElement, createCostTemplate(), 'beforeend');

  headerMainElement.insertAdjacentElement('afterbegin', infoSectionElement);
};

createInfoData();
render(headerNavigationElement, createMenuTemplate(), 'beforeend');
render(headerFiltersElement, createFiltersTemplate(), 'beforeend');
render(mainEventsElement, createSortingTemplate(), 'beforeend');
createListData();
