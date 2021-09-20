import SiteMenuView from './view/menu.js';
import CostTripView from './view/cost-trip.js';
import InfoTripView from './view/info-trip.js';
import StatisticsView from './view/statisticts.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';
import Api from './api/api.js';
import { remove } from './utils/render.js';
import { getCostTrip } from './utils/get-cost.js';
import { UpdateType, FilterType } from './const.js';
import {isOnline} from './utils/common.js';
import {toast} from './utils/toast.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const STORE_PREFIX = 'bigTrip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const AUTHORIZATION = 'Basic hS2sd3dfSwcl1sa2j';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

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
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(headerFiltersElement, filterModel, pointsModel);

const handlePointNewFormClose = () => {

};

let statisticsComponent = null;

const handleAddPointBtnClick = (evt) => {
  evt.target.disabled = true;
  remove(statisticsComponent);
  tripPresenter.destroy();

  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();

  tripPresenter.createPoint(handlePointNewFormClose, evt.target);
  if (!isOnline()) {
    toast('You can\'t create new point offline');
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
  }

};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      //filterModel.setItemMenu(UpdateType.MAJOR, MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const createInfoData = (points) => ({
  isManyCities: points.length > 3 ? 'true' : 'false',
  cities: points.length !== 0 ? points.map((point) => point.destination.name).slice(3) : '',
  startDate: points.length !== 0 ? points[0].dateFrom : '',
  endDate: points.length !== 0 ? points[points.length - 1].dateTo : '',
  cost: points.length !== 0 ? getCostTrip(points) : '',
});

const createInfoModel = (infoData) => {
  const infoSectionElement = document.createElement('section');
  infoSectionElement.classList.add('trip-main__trip-info',  'trip-info');

  render(infoSectionElement, new InfoTripView(infoData).getElement(), RenderPosition.BEFOREEND);
  render(infoSectionElement, new CostTripView(infoData.cost).getElement(), RenderPosition.BEFOREEND);
  render(headerMainElement, infoSectionElement, RenderPosition.AFTERBEGIN);
};

filterPresenter.init();
tripPresenter.init();

apiWithProvider.getDestinations()
  .then((destinationsData) => {
    pointsModel.setDestinations(destinationsData);
  });

apiWithProvider.getOffers().
  then((offersData) => {
    pointsModel.setOffers(offersData);
  });

apiWithProvider.getPoints()
  .then((points) => {
    createInfoModel(createInfoData(points));
    addPointButton.addEventListener('click', handleAddPointBtnClick);
    filterPresenter.init();
    pointsModel.setPoints(UpdateType.INIT, points);

    render(headerNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    addPointButton.addEventListener('click', handleAddPointBtnClick);
    filterPresenter.init();
    pointsModel.setPoints(UpdateType.INIT, []);

    render(headerNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
