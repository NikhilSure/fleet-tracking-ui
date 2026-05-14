import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

import 'leaflet-routing-machine';

import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface VehicleLocation {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: number;
}

@Component({
  selector: 'app-live-map-page',
  standalone: true,
  imports: [
    FormsModule,
    ToggleSwitchModule
  ],
  templateUrl: './live-map-page.html',
  styleUrl: './live-map-page.scss',
})
export class LiveMapPage {

  private map!: L.Map;

  private markers =
    new Map<string, L.Marker>();

  vehicleTrips:
    Record<string, VehicleLocation[]> = {};

  private lastPositions:
    Record<string, VehicleLocation> = {};

  private routeLines =
    new Map<string, L.Polyline>();

  private routeInfo:
    Record<string, {
      distance: string;
      duration: number;
      instructions: any[];
    }> = {};

  selectedLayer:
    keyof typeof this.baseLayers = 'dark';

  private baseLayers = {

    osm: L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'OpenStreetMap'
      }
    ),

    dark: L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: 'CartoDB Dark'
      }
    ),

    satellite: L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        attribution: 'OpenTopoMap'
      }
    ),

    traffic: L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'Traffic'
      }
    )

  };

  ngAfterViewInit(): void {

    this.initializeMap();

    this.startVehicleTracking();

  }

  ngOnDestroy(): void {

    this.map?.remove();

  }

  private initializeMap(): void {

    this.map = L.map('map', {
      zoomControl: false
    }).setView(
      [17.3850, 78.4867],
      12
    );

    this.baseLayers.dark.addTo(this.map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

  }

  private startVehicleTracking(): void {

    this.loadVehicles();

    setInterval(() => {

      this.loadVehicles();

    }, 4000);

  }

  private loadVehicles(): void {

    const vehicles =
      this.fetchVehicleLocations();

    vehicles.forEach(vehicle => {

      this.vehicleTrips[vehicle.vehicleId] =
        this.vehicleTrips[vehicle.vehicleId] || [];

      this.vehicleTrips[vehicle.vehicleId]
        .push(vehicle);

      // keep only latest points
      if (
        this.vehicleTrips[vehicle.vehicleId]
          .length > 6
      ) {

        this.vehicleTrips[vehicle.vehicleId]
          .shift();

      }

      this.drawTrip(
        vehicle.vehicleId,
        this.vehicleTrips[vehicle.vehicleId]
      );

      this.addOrUpdateVehicle(vehicle);

    });

  }

  private fetchVehicleLocations():
    VehicleLocation[] {

    const baseVehicles = [

      {
        vehicleId: 'TRUCK-01',
        lat: 17.3850,
        lng: 78.4867,
        speed: 65,
        heading: 280
      },

      {
        vehicleId: 'TRUCK-02',
        lat: 17.4123,
        lng: 78.4991,
        speed: 42,
        heading: 120
      },

      {
        vehicleId: 'TRUCK-03',
        lat: 17.3612,
        lng: 78.4742,
        speed: 38,
        heading: 45
      },

      {
        vehicleId: 'TRUCK-04',
        lat: 17.4015,
        lng: 78.5211,
        speed: 78,
        heading: 310
      }

    ];

    return baseVehicles.map(vehicle => {

      const previous =
        this.lastPositions[vehicle.vehicleId];

      // first load
      if (!previous) {

        const firstPosition = {
          ...vehicle,
          timestamp: Date.now()
        };

        this.lastPositions[
          vehicle.vehicleId
        ] = firstPosition;

        return firstPosition;

      }

      // smooth movement
      const nextPosition: VehicleLocation = {

        ...previous,

        lat:
          previous.lat +
          (Math.random() - 0.5) * 0.002,

        lng:
          previous.lng +
          (Math.random() - 0.5) * 0.002,

        timestamp: Date.now()

      };

      this.lastPositions[
        vehicle.vehicleId
      ] = nextPosition;

      return nextPosition;

    });

  }

  private drawTrip(
    vehicleId: string,
    trip: VehicleLocation[]
  ): void {

    if (trip.length < 2) return;

    const waypoints = trip.map(point =>
      L.latLng(point.lat, point.lng)
    );

    const route =
      (L as any).Routing.control({

        waypoints,

        addWaypoints: false,

        draggableWaypoints: false,

        fitSelectedRoutes: false,

        show: false,

        createMarker: () => null,

      })




    route.on('routesfound', (event: any) => {
      const coordinates =
        event.routes[0].coordinates;

      console.log(
        'Route found for',
        vehicleId,
        'with',
        coordinates.length,
        'points'
      );
      const latlngs =
        coordinates.map((c: any) => [
          c.lat,
          c.lng
        ]);

      const existingLine =
        this.routeLines.get(vehicleId);

      // update existing line
      if (existingLine) {

        existingLine.setLatLngs(
          latlngs
        );

      } else {

        // create line first time
        const line = L.polyline(
          latlngs,
          {
            color: '#8b5cf6',
            weight: 5,
            opacity: 0.9
          }
        ).addTo(this.map);

        this.routeLines.set(
          vehicleId,
          line
        );
      }



      const routeData =
        event.routes[0];

      const summary =
        routeData.summary;

      const distance =
        (
          summary.totalDistance / 1000
        ).toFixed(2);

      const duration =
        Math.round(
          summary.totalTime / 60
        );

      const instructions =
        routeData.instructions;

      this.routeInfo[vehicleId] = {
        distance,
        duration,
        instructions

      };

      // update popup dynamically
      const marker =
        this.markers.get(vehicleId);

      if (marker) {

        marker.bindPopup(`

      <div class="vehicle-popup">

        <div class="popup-header">
          🚚 ${vehicleId}
        </div>

        <div class="popup-row">
          <span>Distance</span>
          <b>${distance} km</b>
        </div>

        <div class="popup-row">
          <span>ETA</span>
          <b>${duration} mins</b>
        </div>

        <div class="popup-row">
          <span>Next Step</span>
          <b>
            ${instructions?.[0]?.text ||
          'Moving'
          }
          </b>
        </div>

      </div>

    `);

      }

    });

    route.addTo(this.map);
    const container = route.getContainer();
    if (container) {
      container.style.display = 'none';
    }

  }

  private addOrUpdateVehicle(
    vehicle: VehicleLocation
  ): void {

    const existingMarker =
      this.markers.get(vehicle.vehicleId);

    if (existingMarker) {

      existingMarker.setLatLng([
        vehicle.lat,
        vehicle.lng
      ]);

      return;

    }

    const vehicleIcon = L.icon({
      iconUrl:
        'https://cdn-icons-png.flaticon.com/512/744/744465.png',

      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker(
      [
        vehicle.lat,
        vehicle.lng
      ],
      {
        icon: vehicleIcon
      }
    );

    marker.addTo(this.map);

    this.markers.set(
      vehicle.vehicleId,
      marker
    );

    marker.on('click', () => {
      this.onVehicleClick(
        vehicle.vehicleId
      );

    });

  }

  setLayer(
    type: keyof typeof this.baseLayers
  ) {

    this.selectedLayer = type;

    Object.values(this.baseLayers)
      .forEach(layer => {

        layer.remove();

      });

    this.baseLayers[type]
      .addTo(this.map);

  }

  private onVehicleClick(
    vehicleId: string
  ): void {


    const trip =
      this.vehicleTrips[vehicleId];

    if (!trip || trip.length === 0) {
      return;
    }

    // create bounds from trip points
    const bounds = L.latLngBounds(
      trip.map(point => [
        point.lat,
        point.lng
      ])
    );

    // fit map to vehicle route
    this.map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 16,
      animate: true
    });

    console.log(
      'Selected Vehicle:',
      vehicleId
    );

    console.log(
      'BBox:',
      bounds.toBBoxString()
    );

  }
}