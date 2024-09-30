import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation-service.service';
import { OrderService } from '../services/order-service.service'; // Importáld az OrderService-t
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private translationService: TranslationService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.subscription = this.orderService.orderItems$.subscribe((items) => {
      this.cartItemCount = items.length;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeLanguage(lang: 'en' | 'hu'): void {
    this.translationService.setLanguage(lang);
  }
}
