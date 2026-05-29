import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KpiCard } from './shared/components/kpi-card/kpi-card';
import { Analytics } from "./layouts/analytics/analytics";
import { LiveMapPage } from "./layouts/live-map-page/live-map-page";
import { HttpClient } from '@angular/common/http';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
interface DashboardSummary {
  activeVehicles: number;
  onlineVehicles: number;
  offlineVehicles: number;
  totalAlerts: number;
  averageSpeed: number;
  lowFuelVehicles: number;
}

@Component({
  selector: 'app-root',
  imports: [KpiCard,  Analytics, LiveMapPage, PaginatorModule, CommonModule, ScrollPanelModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fleet-tracking-ui');


  protected kpis:any = [];
  alerts: any[] = [];
  allAlerts: any[] = [];

  pagination: any = {
    totalRecords: 0,
    rows: 10,
    first: 0,
    loading: false
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAlerts();
    this.loadDashboardSummary();
  }

  getAlerts(page: number = 0, size: number = 20): void {
    this.pagination.loading = true;

    this.http
      .get<any>( `http://localhost:8070/api/alerts?page=${page}&size=${size}`)
      .subscribe({
        next: (res) => {
          let response = res.success ? res.data : [];
        this.alerts = (response?.content || []).map((alert: any) => ({

                id: alert.id,

                title: this.getAlertTitle(alert.alert_type),

                message:
                  alert.message ||
                  `${alert.vehicleLocation?.vehicleId} alert triggered`,

                time: this.getTimeAgo(
                  alert.vehicleLocation?.timestamp || alert.timestamp
                ),

                type: this.getSeverityType(alert.severity),

                icon: this.getAlertIcon(alert.alert_type),

                severity: alert.severity,

                vehicleId: alert.vehicleLocation?.vehicleId,

                lat: alert.vehicleLocation?.lat,

                lng: alert.vehicleLocation?.lng,

                speed: alert.vehicleLocation?.speed,

                fuelLevel: alert.vehicleLocation?.fuelLevel,

                engineStatus: alert.vehicleLocation?.engineStatus
              }));

        this.pagination.totalRecords =
          response.totalElements;

        this.pagination.rows =
          response.size;

        this.pagination.first =
          response.page * response.size;

          console.log('Loaded alerts', this.alerts)
        this.pagination.loading = false;
        this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Failed to load alerts', err);
          this.pagination.loading = false;
        }
      });
  }

  onPageChange(event: any): void {

    this.pagination.first = event.first;

    this.pagination.rows = event.rows;

    const page =
      event.first / event.rows;

    this.getAlerts(
      page,
      event.rows
    );
  }

  getAlertTitle(type: string): string {
    switch (type) {

      case 'OVERSPEED':
        return 'Overspeed Alert';

      case 'ENGINEOFF':
        return 'Engine Off Alert';

      case 'ENGINEON':
        return 'Engine On Alert';

      case 'GEOFENCEEXIT':
        return 'Geofence Exit';

      case 'ROUTEDEVIATION':
        return 'Route Deviation';

      case 'VEHICLEIDLE':
        return 'Vehicle Idle';

      default:
        return 'Vehicle Alert';
    }
  }

  getSeverityType(severity: string): string {
    switch (severity) {

      case 'HIGH':
        return 'danger';

      case 'MEDIUM':
        return 'warning';

      case 'LOW':
        return 'info';

      default:
        return 'info';
    }
  }

  getAlertIcon(type: string): string {
    switch (type) {

      case 'OVER_SPEED':
        return 'pi pi-exclamation-triangle';

      case 'ENGINE_OFF':
      case 'ENGINE_ON':
        return 'pi pi-power-off';

      case 'GEOFENCE_EXIT':
        return 'pi pi-map-marker';

      case 'ROUTE_DEVIATION':
        return 'pi pi-directions';

      case 'VEHICLE_IDLE':
        return 'pi pi-pause-circle';

      default:
        return 'pi pi-bell';
    }
  }

  getTimeAgo(timestamp: number): string {

    if (!timestamp) {
      return 'Just now';
    }

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    const intervals: any = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const key in intervals) {

      const value = Math.floor(seconds / intervals[key]);

      if (value > 0) {
        return `${value}${key.charAt(0)} ago`;
      }
    }

    return 'Just now';
  }

  private loadDashboardSummary(): void {
  this.http.get(`http://localhost:8070/api/analytics/kpi`).subscribe({
    next: (response: any) => {
      const data: DashboardSummary = response.data;

      this.kpis = [
        {
          title: 'Active Vehicles',
          value: data.activeVehicles,
          color: 'green',
          icon: 'pi pi-car'
        },
        {
          title: 'Online Vehicles',
          value: data.onlineVehicles,
          color: 'blue',
          icon: 'pi pi-wifi'
        },
        {
          title: 'Offline Vehicles',
          value: data.offlineVehicles,
          color: 'red',
          icon: 'pi pi-times-circle'
        },
        {
          title: 'Total Alerts',
          value: data.totalAlerts,
          color: 'orange',
          icon: 'pi pi-bell'
        },
        {
          title: 'Average Speed',
          value: data.averageSpeed.toFixed(1),
          color: 'purple',
          icon: 'pi pi-gauge'
        },
        {
          title: 'Low Fuel Vehicles',
          value: data.lowFuelVehicles,
          color: 'yellow',
          icon: 'pi pi-exclamation-triangle'
        }
      ];
      this.cdr.detectChanges();
    }
  });
}
}
