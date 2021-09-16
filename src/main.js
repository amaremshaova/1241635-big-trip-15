import SiteMenuView from './view/menu.js';
import FilterView from './view/filters.js';
import CostTripView from './view/cost-trip.js';
import InfoTripView from './view/info-trip.js';
import StatisticsView from './view/statisticts.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import MenuModel from './model/menu.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';
import Api from './api.js';
import { remove } from './utils/render.js';
import { getCostTrip } from './utils/get-cost.js';
import { UpdateType, FilterType } from './const.js';


const AUTHORIZATION = 'Basic er883jdzbdw';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';

const headerMainElement = document.querySelector('.trip-main');
const headerNavigationElement = headerMainElement.querySelector('.trip-controls__navigation');
const headerFiltersElement = headerMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const menuModel = new MenuModel();
const siteMenuComponent = new SiteMenuView(MenuItem.TABLE);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(headerFiltersElement, filterModel, pointsModel);

const handlePointNewFormClose = () => {
  //siteMenuComponent.getElement().querySelector(`[name=${MenuItem.TABLE}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createPoint(handlePointNewFormClose);
      siteMenuComponent.getElement().querySelector(`[name=${MenuItem.POINTS}]`).disabled = true;
      break;
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      filterModel.setItemMenu(UpdateType.MAJOR, MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      menuModel.setItemMenu(UpdateType.MAJOR, MenuItem.STATS);
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

api.getDestinations()
  .then((destinations) => {
    pointsModel.setDestinations(destinations);
  })
  .then(() => {api.getOffers()
    .then((offers) => {
      pointsModel.setOffers(offers);
    });})
  .then(() => {api.getPoints()
    .then((points) => {
      createInfoModel(createInfoData(points));
      filterPresenter.init();
      pointsModel.setPoints(UpdateType.INIT, points);
      render(headerNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    });
  })
  .catch(() => {
    //createInfoModel(createInfoData([]));
    filterPresenter.init();
    pointsModel.setPoints(UpdateType.INIT, []);
    render(headerNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

