import { Injectable } from '@angular/core';
import { CakeModel } from '../models/cake.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderKey = 'orderItems';
  private orderItemsSubject = new BehaviorSubject<CakeModel[]>(
    this.getOrderItems()
  );

  // Observable a kosár tartalmához
  orderItems$ = this.orderItemsSubject.asObservable();

  getOrderItems(): CakeModel[] {
    const items = sessionStorage.getItem(this.orderKey);
    return items ? JSON.parse(items) : [];
  }

  addToOrder(cake: CakeModel) {
    const items = this.getOrderItems();
    items.push(cake);
    sessionStorage.setItem(this.orderKey, JSON.stringify(items));
    this.orderItemsSubject.next(items); // Értesítjük a megfigyelőket
  }

  removeFromOrder(index: number) {
    const items = this.getOrderItems();
    items.splice(index, 1);
    sessionStorage.setItem(this.orderKey, JSON.stringify(items));
    this.orderItemsSubject.next(items); // Értesítjük a megfigyelőket
  }

  clearOrder() {
    sessionStorage.removeItem(this.orderKey);
    this.orderItemsSubject.next([]); // Értesítjük a megfigyelőket
  }
}
