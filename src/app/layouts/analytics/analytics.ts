import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { NgxEchartsModule } from 'ngx-echarts';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule,
    ButtonModule
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics implements OnInit {

  private http = inject(HttpClient);

  loading = false;

  dashboardCards: any[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  // =========================
  // DASHBOARD LOAD
  // =========================

  loadDashboard(): void {

    // this.loading = true;

    Promise.all([
      this.getFleetActivity(),
      this.getVehicleStatus(),
      this.getAlertsTrend(),
      this.getTripAnalytics()
    ])
      .then(([fleet, vehicle, alerts, trip]) => {

        this.dashboardCards = [

          {
            title: 'Fleet Activity',
            chart: fleet,
            icon: 'pi pi-chart-line',
            col: 'col-12 xl:col-3'
          },

          {
            title: 'Vehicle Status',
            chart: vehicle,
            icon: 'pi pi-car',
            col: 'col-12 md:col-6 xl:col-3'
          },

          {
            title: 'Alerts Trend',
            chart: alerts,
            icon: 'pi pi-bell',
            col: 'col-12 md:col-6 xl:col-3'
          },

          {
            title: 'Trip Analytics',
            chart: trip,
            icon: 'pi pi-compass',
            col: 'col-12  xl:col-3'
          }
        ];

      })
      .finally(() => {
        this.loading = false;
      });
  }

  // =========================
  // API CALLS
  // =========================

  async getFleetActivity(): Promise<any> {

    // Replace with API
    // return this.http.get('api/fleet-activity').toPromise();

    const response = {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      trips: [120, 132, 101, 134, 190, 230, 210],
      online: [80, 82, 79, 88, 91, 95, 98]
    };

    return this.buildFleetActivityChart(response);
  }

  async getVehicleStatus(): Promise<any> {

    const response = [
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
    ];

    return this.buildVehicleStatusChart(response);
  }

  async getAlertsTrend(): Promise<any> {

    const response = {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      alerts: [5, 20, 36, 10, 15]
    };

    return this.buildAlertsChart(response);
  }

  async getTripAnalytics(): Promise<any> {

    const response = {
      value: [220, 70, 120, 40, 18]
    };

    return this.buildTripChart(response);
  }

  // =========================
  // CHART BUILDERS
  // =========================

  buildFleetActivityChart(data: any): any {

    return {

      tooltip: {
        trigger: 'axis',
        backgroundColor: '#111827',
        borderWidth: 0,
        textStyle: {
          color: '#fff'
        }
      },

      legend: {
        top: 0,
        textStyle: {
          color: '#64748b'
        }
      },

      grid: {
        left: 10,
        right: 10,
        top: 50,
        bottom: 10,
        containLabel: true
      },

      xAxis: {
        type: 'category',

        boundaryGap: false,

        data: data.days,

        axisLine: {
          lineStyle: {
            color: '#e2e8f0'
          }
        },

        axisLabel: {
          color: '#64748b'
        }
      },

      yAxis: {

        type: 'value',

        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#e2e8f0'
          }
        },

        axisLabel: {
          color: '#64748b'
        }
      },

      series: [

        {
          name: 'Trips',

          type: 'line',

          smooth: true,

          symbol: 'circle',

          symbolSize: 8,

          areaStyle: {
            opacity: 0.08
          },

          emphasis: {
            focus: 'series'
          },

          data: data.trips
        },

        {
          name: 'Online',

          type: 'line',

          smooth: true,

          symbol: 'circle',

          symbolSize: 8,

          areaStyle: {
            opacity: 0.08
          },

          emphasis: {
            focus: 'series'
          },

          data: data.online
        }
      ]
    };
  }

  buildVehicleStatusChart(data: any): any {

    return {

      tooltip: {
        trigger: 'item'
      },

      legend: {
        bottom: 0
      },

      series: [

        {
          type: 'pie',

          radius: ['55%', '78%'],

          avoidLabelOverlap: true,

          itemStyle: {
            borderRadius: 12,
            borderColor: '#fff',
            borderWidth: 4
          },

          label: {
            show: true,
            formatter: '{b}\n{c}'
          },

          emphasis: {
            scale: true,
            scaleSize: 8
          },

          data
        }
      ]
    };
  }

  buildAlertsChart(data: any): any {

    return {

      tooltip: {
        trigger: 'axis'
      },

      grid: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 10,
        containLabel: true
      },

      xAxis: {

        type: 'category',

        data: data.days,

        axisLabel: {
          color: '#64748b'
        }
      },

      yAxis: {

        type: 'value',

        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },

        axisLabel: {
          color: '#64748b'
        }
      },

      series: [

        {
          data: data.alerts,

          type: 'bar',

          barWidth: 28,

          borderRadius: [
            10,
            10,
            0,
            0
          ]
        }
      ]
    };
  }

  buildTripChart(data: any): any {

    return {

      tooltip: {},

      radar: {

        radius: '65%',

        splitNumber: 5,

        axisName: {
          color: '#64748b'
        },

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

          areaStyle: {
            opacity: 0.2
          },

          data: [
            {
              value: data.value
            }
          ]
        }
      ]
    };
  }

  // =========================
  // REFRESH
  // =========================

  refreshDashboard(): void {
    this.loadDashboard();
  }
}