import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryLinkComponent } from './country-link.component';

describe('CountryLinkComponent', () => {
  let component: CountryLinkComponent;
  let fixture: ComponentFixture<CountryLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
