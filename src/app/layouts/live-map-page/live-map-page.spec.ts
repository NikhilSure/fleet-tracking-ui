import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMapPage } from './live-map-page';

describe('LiveMapPage', () => {
  let component: LiveMapPage;
  let fixture: ComponentFixture<LiveMapPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMapPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveMapPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
