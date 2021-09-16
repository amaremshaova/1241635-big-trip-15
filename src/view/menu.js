import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createMenuTemplate = (currentItemMenu) => (`
<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn ${currentItemMenu === MenuItem.TABLE ? 'trip-tabs__btn--active' : ''}" name=${MenuItem.TABLE} href="#">Table</a>
                <a class="trip-tabs__btn ${currentItemMenu === MenuItem.STATS ? 'trip-tabs__btn--active' : ''}" name=${MenuItem.STATS} href="#">Stats</a>
              </nav>`);

export default class Menu extends AbstractView {

  constructor(currentItemMenu) {
    super();
    this._currentItemMenu = currentItemMenu;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._currentItemMenu);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.name);
    this._currentItemMenu = evt.target.name;
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;


    this.getElement().addEventListener('click', this._menuClickHandler);
  }

/* setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[name=${menuItem}]`);

  }*/
}
