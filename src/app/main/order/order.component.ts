import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order-service.service';
import { CakeModel } from 'src/app/models/cake.model';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderItems: CakeModel[] = [];
  orderForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      deliveryMethod: ['Személyes átvétel', Validators.required],
      date: ['', Validators.required],
      message: [''],
      items: this.fb.array([]), // FormArray for the order items
    });
  }

  ngOnInit() {
    // Subscribe to the order items from the service
    this.orderService.orderItems$.subscribe((items) => {
      this.orderItems = items;
      this.populateOrderItems();
    });

    // Listen for changes in the form and update the CakeModel accordingly
    this.orderForm.valueChanges.subscribe((formValues) => {
      this.updateOrderItems(formValues.items);
    });
  }

  // Getter for accessing the FormArray
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  // Populate the form with current order items
  private populateOrderItems() {
    const itemsArray = this.orderForm.get('items') as FormArray;
    itemsArray.clear(); // Clear the existing controls

    this.orderItems.forEach((item) => {
      itemsArray.push(
        this.fb.group({
          quantity: [item.quantity || 1, Validators.required],
          comment: [item.comment || ''],
        })
      );
    });
  }

  // Update the CakeModel array whenever the form values change
  private updateOrderItems(formItems: any) {
    formItems.forEach((formItem: any, index: number) => {
      this.orderItems[index].quantity = formItem.quantity;
      this.orderItems[index].comment = formItem.comment;
    });
  }

  // Remove item from the order
  removeFromOrder(index: number) {
    this.orderService.removeFromOrder(index);
    this.orderItems = this.orderService.getOrderItems();
    this.items.removeAt(index);
  }

  submitOrder() {
    if (this.orderForm.invalid || this.orderItems.length === 0) {
      alert(
        'Kérlek, töltsd ki az összes szükséges mezőt és győződj meg róla, hogy van rendelés!'
      );
      return;
    }

    // Rendelés részletei (az orderItems frissített tömbjéből)
    const orderDetails = this.orderItems
      .map((item) => {
        return `Név: ${item.name}; Darabszám: ${
          item.quantity || 1
        }; Megjegyzés: ${item.comment || 'Nincs megadva'}`;
      })
      .join('\n');

    // E-mail küldése az összes tételről
    const emailData = {
      to: 'bagettos@gmail.com',
      subject: `Rendelés ${this.orderForm.value.name} ${this.orderForm.value.date}`,
      body: `
      Kedves Mókusch Café!\n
      ${this.orderForm.value.name} vagyok és az alábbi termékeket szeretném kérni tőletek a ${this.orderForm.value.date} dátumra, ${this.orderForm.value.deliveryMethod} átvételi módon.\n\n
      Adataim:\n
      E-mail: ${this.orderForm.value.email}\n
      Név: ${this.orderForm.value.name}\n
      Telefonszám: ${this.orderForm.value.phone}\n
      Egyéb megjegyzés: ${this.orderForm.value.message}\n\n
      Rendelés részletei:\n
      ${orderDetails}\n
      Köszönöm,\n
      ${this.orderForm.value.name}
      `,
    };

    this.http
      .post('https://mokusch-cafe-backend.onrender.com/send-email', emailData)
      .subscribe({
        next: (_response) => {
          alert('A rendelés sikeresen elküldve!');
        },
        error: (_error) => {
          alert('Hiba történt az e-mail küldésekor!');
        },
        complete: () => {
          console.log('Email küldés befejezve.');
        },
      });
  }
}
