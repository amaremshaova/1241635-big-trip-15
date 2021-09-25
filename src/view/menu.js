import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createMenuTemplate = (currentItemMenu ) => (`<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  ${currentItemMenu === MenuItem.TABLE ? 'trip-tabs__btn--active' : ''}"
                name=${MenuItem.TABLE} href="#">Table</a>
                <a class="trip-tabs__btn ${currentItemMenu === MenuItem.STATS ? 'trip-tabs__btn--active' : ''}"
                name=${MenuItem.STATS} href="#">Stats</a>
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

  setItemMenu(currentItemMenu){
    this._currentItemMenu = currentItemMenu;
    const itemTable = this.getElement().querySelector(`[name=${MenuItem.TABLE}]`);
    const itemStats = this.getElement().querySelector(`[name=${MenuItem.STATS}]`);

    if (currentItemMenu === MenuItem.TABLE && !itemTable.classList.contains('trip-tabs__btn--active')){
      itemTable.classList.add('trip-tabs__btn--active');
      itemStats.classList.remove('trip-tabs__btn--active');
    }
    if (currentItemMenu === MenuItem.STATS && !itemStats.classList.contains('trip-tabs__btn--active')){
      itemTable.classList.remove('trip-tabs__btn--active');
      itemStats.classList.add('trip-tabs__btn--active');
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.name);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelectorAll('.trip-tabs__btn').forEach((item) =>
      item.addEventListener('click', this._menuClickHandler));
  }
}
