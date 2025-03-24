import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private countryApiUrl = 'https://restcountries.com/v3.1/all';  
  private countryDetailApiUrl = 'https://restcountries.com/v3.1/alpha/'; 

  constructor(private http: HttpClient) { }

  
  getCountryCodes(): Observable<{ code: string, name: string }[]> {
    return this.http.get<any[]>(this.countryApiUrl).pipe(
      map(countries => countries.map(country => ({
        code: country.cca2, 
        name: country.name.common 
      })).sort((a, b) => a.name.localeCompare(b.name))), 
      catchError(error => {
        console.error("Error fetching country codes:", error);
        throw error;
      })
    );
  }

  
  getCurrencyInfo(countryCode: string): Observable<{ currency: string, symbol: string } | null> {
    return this.http.get<any>(`${this.countryDetailApiUrl}${countryCode}`).pipe(
      map(response => {
        const countryData = response[0]; 
        if (countryData && countryData.currencies) {
          const currencyCode = Object.keys(countryData.currencies)[0];
          return {
            currency: currencyCode,
            symbol: countryData.currencies[currencyCode].symbol || ''
          };
        }
        return null;
      }),
      catchError(error => {
        console.error("Error fetching currency info:", error);
        throw error;
      })
    );
  }
}
