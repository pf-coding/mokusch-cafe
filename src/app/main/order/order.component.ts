import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order-service.service';
import { CakeModel } from 'src/app/models/cake.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderItems: CakeModel[] = [];
  http: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderItems = this.orderService.getOrderItems();
  }

  removeFromOrder(index: number) {
    this.orderService.removeFromOrder(index);
    this.orderItems = this.orderService.getOrderItems();
  }

  submitOrder() {
    const orderDetails = this.orderItems
      .map((item) => {
        return `name: ${item.name}; comment: ${
          item.comment || 'Nincs megadva'
        }; quantity: ${item.quantity}`;
      })
      .join('\n');

    const emailContent = `Szia!\n\nSzeretnék leadni egy rendelést az alábbi termékekre:\n- ${orderDetails}\n\nKöszönöm,\nxy`;

    const emailData = {
      to: 'bagettos@gmail.com',
      subject: 'Rendelés',
      body: emailContent,
    };

    // // Küldd el az e-mailt a backend API-nak
    // this.http
    //   .post('http://your-backend-api.com/send-email', emailData)
    //   .subscribe(
    //     (response: any) => {
    //       console.log('E-mail sikeresen elküldve:', response);
    //     },
    //     (error: any) => {
    //       console.error('Hiba az e-mail küldésekor:', error);
    //     }
    //   );
  }
}
