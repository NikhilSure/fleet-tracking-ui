import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import * as echarts
  from 'echarts/core';

import {
  BarChart,
  LineChart,
  RadarChart,
  PieChart,
  GaugeChart,
  ScatterChart
} from 'echarts/charts';

import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';

import {
  CanvasRenderer
} from 'echarts/renderers';
import {
  provideEchartsCore
} from 'ngx-echarts';

import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';

import { providePrimeNG } from 'primeng/config';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideEchartsCore({
      echarts
    })
  ]
};

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  RadarChart,
  PieChart,
  GaugeChart,
  ScatterChart,

]);


