import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KpiCard } from './shared/components/kpi-card/kpi-card';
import { Analytics } from "./layouts/analytics/analytics";
import { LiveMapPage } from "./layouts/live-map-page/live-map-page";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KpiCard, Analytics, LiveMapPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fleet-tracking-ui');


  protected readonly kpis = [
    {
      title: 'Total Vehicles',
      value: 120,
      color: 'blue',
      icon: 'pi pi-car'
    },
    {
      title: 'Active Vehicles',
      value: 95,
      color: 'green',
      icon: 'pi pi-check'
    },
    {
      title: 'Inactive Vehicles',
      value: 25,
      color: 'red',
      icon: 'pi pi-times'
    }
  ]

    // ALERT FEED DATA
  alerts: any = [
    {
      id: 1,
      title: 'Overspeed Alert',
      message: 'TN09AB1234 exceeded speed limit (102 km/h)',
      time: '2m ago',
      type: 'danger',
      icon: 'pi pi-exclamation-triangle'
    },
    {
      id: 2,
      title: 'Geofence Exit',
      message: 'Truck exited Hyderabad zone boundary',
      time: '5m ago',
      type: 'warning',
      icon: 'pi pi-map-marker'
    },
    {
      id: 3,
      title: 'Vehicle Idle',
      message: 'Vehicle idle for more than 30 minutes',
      time: '10m ago',
      type: 'info',
      icon: 'pi pi-pause-circle'
    },
    {
      id: 4,
      title: 'Route Deviation',
      message: 'Vehicle deviated from planned route',
      time: '15m ago',
      type: 'warning',
      icon: 'pi pi-directions'
    },
    {
      id: 5,
      title: 'Engine On Alert',
      message: 'Vehicle started after long stop',
      time: '20m ago',
      type: 'info',
      icon: 'pi pi-power-off'
    }
  ];
}
