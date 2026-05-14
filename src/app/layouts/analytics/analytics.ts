import { Component } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {

  fleetActivityChart = {

    tooltip: {
      trigger: 'axis'
    },

    legend: {
      data: [
        'Trips',
        'Online'
      ]
    },

    xAxis: {

      type: 'category',

      data: [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
      ]
    },

    yAxis: {
      type: 'value'
    },

    series: [

      {
        name: 'Trips',

        type: 'line',

        smooth: true,

        data: [
          120,
          132,
          101,
          134,
          190,
          230,
          210
        ]
      },

      {
        name: 'Online',

        type: 'line',

        smooth: true,

        data: [
          80,
          82,
          79,
          88,
          91,
          95,
          98
        ]
      }
    ]
  };


  vehicleStatusChart = {

    tooltip: {
      trigger: 'item'
    },

    series: [

      {
        type: 'pie',

        radius: '70%',

        data: [

          {
            value: 98,
            name: 'Online'
          },

          {
            value: 26,
            name: 'Offline'
          },

          {
            value: 12,
            name: 'Idle'
          }
        ]
      }
    ]
  };





  alertsChart = {

    xAxis: {

      type: 'category',

      data: [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri'
      ]
    },

    yAxis: {
      type: 'value'
    },

    series: [

      {
        data: [
          5,
          20,
          36,
          10,
          15
        ],

        type: 'bar'
      }
    ]
  };




  tripChart = {

    radar: {

      indicator: [

        {
          name: 'Trips',
          max: 300
        },

        {
          name: 'Fuel',
          max: 100
        },

        {
          name: 'Speed',
          max: 150
        },

        {
          name: 'Idle',
          max: 80
        },

        {
          name: 'Alerts',
          max: 50
        }
      ]
    },

    series: [

      {
        type: 'radar',

        data: [

          {
            value: [
              220,
              70,
              120,
              40,
              18
            ]
          }
        ]
      }
    ]
  };

  dashboardCards = [
  {
    title: 'Fleet Activity',
    chart: this.fleetActivityChart,
    col: 'col-12 lg:col-8'
  },
  {
    title: 'Vehicle Status',
    chart: this.vehicleStatusChart,
    col: 'col-12 lg:col-4'
  },
  {
    title: 'Alerts Trend',
    chart: this.alertsChart,
    col: 'col-12 lg:col-6'
  },
  {
    title: 'Trip Analytics',
    chart: this.tripChart,
    col: 'col-12 lg:col-6'
  }
];



}
