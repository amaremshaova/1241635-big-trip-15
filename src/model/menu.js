import AbstractObserver from '../utils/abstract-observer.js';
import {MenuItem} from '../const.js';

export default class Menu extends AbstractObserver {
  constructor() {
    super();
    this._activeItemMenu = MenuItem.TABLE;
  }

  setItemMenu(updateType, itemMenu) {
    this._activeItemMenu = itemMenu;
    this._notify(updateType, itemMenu);
  }

  getItemMenu() {
    return this._activeItemMenu;
  }
}
