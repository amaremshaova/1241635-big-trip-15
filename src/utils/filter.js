import {FilterType} from '../const';
import { isPointFuture, isPointPast } from './point';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateFrom, point.dateTo)),
  [FilterType.FAVORITES]: (points) => points.filter((point) => point.isFavorite),
};
