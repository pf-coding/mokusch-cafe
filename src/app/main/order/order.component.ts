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
      items: this.fb.array([]),
    });
  }

  private populateOrderItems() {
    const itemsArray = this.orderForm.get('items') as FormArray;
    itemsArray.clear(); // Clear the existing controls

    this.orderItems.forEach((item) => {
      itemsArray.push(
        this.fb.group({
          id: [item.id],
          name: [item.name],
          quantity: [item.quantity || 1, Validators.required],
          comment: [item.comment || ''],
        })
      );
    });
  }

  ngOnInit() {
    this.orderService.orderItems$.subscribe((items) => {
      this.orderItems = items;
      this.populateOrderItems();
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addOrderItemsToForm() {
    this.items.clear(); // Clear previous items
    this.orderItems.forEach((item: CakeModel) => {
      const itemGroup = this.fb.group({
        quantity: [
          item.quantity || 1, // Default quantity
          [Validators.required, Validators.min(1)],
        ],
        comment: [item.comment || ''], // Default comment
      });
      this.items.push(itemGroup);
    });
  }

  removeFromOrder(index: number) {
    this.orderService.removeFromOrder(index);
    this.orderItems = this.orderService.getOrderItems();
    this.items.removeAt(index);
  }

  submitIndividualOrder(index: number) {
    const formValues = this.items.at(index).value;

    if (formValues.quantity < 1) {
      alert('Kérlek, add meg a darabszámot!');
      return;
    }

    // Update the specific item
    const updatedItem = {
      ...this.orderItems[index],
      quantity: formValues.quantity,
      comment: formValues.comment,
    };

    // Send email for the specific item
    const emailData = {
      to: 'bagettos@gmail.com',
      subject: `Rendelés ${this.orderForm.value.name} ${this.orderForm.value.date}`,
      body: `
      Kedves Mókusch Café!\n
      ${this.orderForm.value.name} és az alábbi terméket szeretném kérni tőletek a ${this.orderForm.value.date} dátumra, ${this.orderForm.value.deliveryMethod} módon.\n\n
      Adataim:\n
      E-mail: ${this.orderForm.value.email}\n
      Név: ${this.orderForm.value.name}\n
      Telefonszám: ${this.orderForm.value.phone}\n
      Egyéb megjegyzés: ${this.orderForm.value.message}\n\n
      Rendelés részletei:\n
      Név: ${updatedItem.name}; Darabszám: ${updatedItem.quantity}; Megjegyzés: ${updatedItem.comment}\n
      Köszönöm,\n
      ${this.orderForm.value.name}
      `,
    };

    this.http
      .post('https://mokusch-cafe-backend.onrender.com/send-email', emailData)
      .subscribe(
        (response) => {
          alert('A rendelés sikeresen elküldve!');
        },
        (error) => {
          alert('Hiba történt az e-mail küldésekor!');
          console.error(
            'Hiba az e-mail küldésekor:',
            error.error?.error || error.message
          );
        }
      );
  }

  submitOrder() {
    if (this.orderForm.invalid || this.orderItems.length === 0) {
      alert(
        'Kérlek, töltsd ki az összes szükséges mezőt és győződj meg róla, hogy van rendelés!'
      );
      return;
    }

    // Rendelés részletei (összes tétel)
    const orderDetails = this.orderItems
      .map((item, index) => {
        const formValues = this.items.at(index).value;
        return `Név: ${item.name}; Darabszám: ${
          formValues.quantity
        }; Megjegyzés: ${formValues.comment || 'Nincs megadva'}`;
      })
      .join('\n');

    console.log('Rendelés részletei:', orderDetails); // Debugging

    // E-mail küldése az összes tételről
    const emailData = {
      to: 'bagettos@gmail.com',
      subject: `Rendelés ${this.orderForm.value.name} ${this.orderForm.value.date}`,
      body: `
      Kedves Mókusch Café!\n
      ${this.orderForm.value.name} és az alábbi termékeket szeretném kérni tőletek a ${this.orderForm.value.date} dátumra, ${this.orderForm.value.deliveryMethod} módon.\n\n
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
      .subscribe(
        (response) => {
          alert('A rendelés sikeresen elküldve!');
        },
        (error) => {
          alert('Hiba történt az e-mail küldésekor!');
          console.error(
            'Hiba az e-mail küldésekor:',
            error.error?.error || error.message
          );
        }
      );
  }
}
