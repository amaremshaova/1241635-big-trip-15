import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { countPointsInMoneyRange, countPointsInTypesRange, countPointsInTimesSpendRange} from '../utils/statisticts.js';
import { getDuration } from '../utils/point.js';

const renderMoneyChart = (moneyCtx, points) =>{
  const types = [];
  const money = [];

  const pointInMoneyRangeCounts = countPointsInMoneyRange(points);
  pointInMoneyRangeCounts.forEach((point) => {
    types.push(point.type);
    money.push(point.money);
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels:  types,
      datasets: [{
        data: money,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const renderTypesChart = (typesCtx, points) => {

  const types = [];
  const countPoints = [];

  const pointInTypesRangeCounts = countPointsInTypesRange(points);
  pointInTypesRangeCounts.forEach((point) => {
    types.push(point.type);
    countPoints.push(point.countPoints);
  });


  return new Chart(typesCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: countPoints,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeSpendCtx, points) => {

  const types = [];
  const timesSpend = [];

  const pointInTimesSpendRangeCounts = countPointsInTimesSpendRange(points);

  pointInTimesSpendRangeCounts.forEach((point) => {
    types.push(point.type);
    timesSpend.push(point.timeSpend);
  });

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: timesSpend,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart statistic__money" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart statistic__type" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart statistic__type-spend" id="time-spend" width="900"></canvas>
  </div>
</section>`;

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._data = {
      points,
    };

    this._moneyChart = null;
    this._typesChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typesChart !== null) {
      this._moneyChart = null;
      this._typesChart = null;
    }

    const {points} = this._data;

    const moneyCtx = this.getElement().querySelector('.statistic__money');
    const typesCtx = this.getElement().querySelector('.statistic__type');
    const timeSpendCtx = this.getElement().querySelector('.statistic__type-spend');

    this._moneyChart = renderMoneyChart(moneyCtx, points);
    this._typeChart = renderTypesChart(typesCtx, points);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, points);
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typesChart !== null) {
      this._moneyChart = null;
      this._typesChart = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
  }

}
