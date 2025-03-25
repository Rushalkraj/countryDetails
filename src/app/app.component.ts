import { Component, OnInit } from '@angular/core';
import { CountryService } from './services/country.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  countries: { code: string, name: string }[] = [];
  selectedCountryCode: string = '';
  currencyInfo: { currency: string, symbol: string } | null = null;
  loading = false;

  constructor(private countryService: CountryService) { }

  ngOnInit() {

    this.loading = true;
    this.countryService.getCountryCodes().subscribe({
      next: data => {
        this.countries = data;
        this.loading = false;
      },
      complete:  () => this.loading = false
    });
  }

  onCountryChange() {
    if (this.selectedCountryCode) {
      this.currencyInfo = null;
      this.loading = true;

      this.countryService.getCurrencyInfo(this.selectedCountryCode).subscribe({
        next: data => {
          this.currencyInfo = data;
        },
        complete: () => this.loading = false
    });
    }
  }
}
