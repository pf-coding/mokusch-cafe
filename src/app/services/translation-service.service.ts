import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CakeModel } from '../models/cake.model';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private jsonUrls = {
    hu: 'assets/cakesHUN.json',
    en: 'assets/cakesENG.json',
  };

  private currentLanguage: 'en' | 'hu' = 'hu';
  private cakes: CakeModel[] = [];

  private cakesSubject = new BehaviorSubject<CakeModel[]>([]);
  public cakes$ = this.cakesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCakes();
  }

  private loadCakes(): void {
    this.getCakes().subscribe((data: CakeModel[]) => {
      this.cakes = data;
      this.cakesSubject.next(this.cakes); // Update the cakes observable
    });
  }

  getCakes(): Observable<CakeModel[]> {
    return this.http.get<CakeModel[]>(this.jsonUrls[this.currentLanguage]);
  }

  setLanguage(lang: 'en' | 'hu'): void {
    this.currentLanguage = lang;
    this.loadCakes(); // Reload cakes when language changes
  }

  getLanguage(): 'en' | 'hu' {
    return this.currentLanguage;
  }
}
