import SiteMenuView from './view/menu.js';
import StatisticsView from './view/statisticts.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points';
import FilterModel from './model/filter.js';
import {FilterType, MenuItem} from './const.js';
import Api from './api/api.js';
import { remove } from './utils/render.js';
import { UpdateType} from './const.js';
import {isOnline} from './utils/common.js';
import {toast} from './utils/toast.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic er883jdzbdw';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const STORE_PREFIX = 'bigTrip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const headerMainElement = document.querySelector('.trip-main');
const headerNavigationElement = headerMainElement.querySelector('.trip-controls__navigation');
const headerFiltersElement = headerMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const addPointButton = document.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const siteMenuComponent = new SiteMenuView(MenuItem.TABLE);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, apiWithProvider, addPointButton);
const filterPresenter = new FilterPresenter(headerFiltersElement, filterModel, pointsModel, addPointButton);

let statisticsComponent = null;

const handleAddPointBtnClick = (evt) => {
  siteMenuComponent.setItemMenu(MenuItem.TABLE);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  evt.target.disabled = true;
  remove(statisticsComponent);

  tripPresenter.destroy();
  tripPresenter.init();
  tripPresenter.createPoint(evt.target);

  if (!isOnline()) {
    toast('You can\'t create new point offline');
    siteMenuComponent.setItemMenu(MenuItem.TABLE);
  }

};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      siteMenuComponent.setItemMenu(MenuItem.TABLE);
      addPointButton.disabled = false;
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case MenuItem.STATS:
      siteMenuComponent.setItemMenu(MenuItem.STATS);
      addPointButton.disabled = false;
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init();
tripPresenter.init();

apiWithProvider.getDestinations()
  .then((destinationsData) => {
    pointsModel.setDestinations(destinationsData);
  }).
  catch(() => {
    pointsModel.setDestinations(UpdateType.INIT, []);
  });

apiWithProvider.getOffers().
  then((offersData) => {
    pointsModel.setOffers(offersData);
  }).
  catch(() => {
    pointsModel.setOffers(UpdateType.INIT, []);
  });


apiWithProvider.getPoints()
  .then((points) => {

    addPointButton.addEventListener('click', handleAddPointBtnClick);
    pointsModel.setPoints(UpdateType.INIT, points);

    render(headerNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    addPointButton.addEventListener('click', handleAddPointBtnClick);
    pointsModel.setPoints(UpdateType.INIT, []);

    render(headerNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

/*window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});*/

/*window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});*/
