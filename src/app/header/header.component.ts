import { Component } from '@angular/core';
import { TranslationService } from '../services/translation-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private translationService: TranslationService) {}

  changeLanguage(lang: 'en' | 'hu'): void {
    this.translationService.setLanguage(lang);
  }
}
