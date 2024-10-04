import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order-service.service';
import { CakeModel } from 'src/app/models/cake.model';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

declare var bootstrap: any; // Declare bootstrap globally

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderItems: CakeModel[] = [];
  orderForm: FormGroup;
  currentDate: string;
  availableTimes: string[] = [];

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
      time: [{ value: '', disabled: true }], // Initially disabled
      message: [''],
      items: this.fb.array([]), // FormArray for the order items
    });

    const today = new Date();
    today.setDate(today.getDate() + 7);
    this.currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD formátum
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

    // Listen for changes in the date control
    this.orderForm.get('date')?.valueChanges.subscribe((selectedDate) => {
      if (selectedDate) {
        this.updateAvailableTimes(new Date(selectedDate));
        this.orderForm.get('time')?.enable(); // Enable the time field
      } else {
        this.orderForm.get('time')?.disable(); // Disable the time field if no date is selected
      }
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

  get totalPrice(): number {
    return this.orderItems.reduce((total, item, i) => {
      const quantity = this.items.at(i).get('quantity')?.value || 0; // Safe access with default value
      const additionalPrice = item.additionalPrice || 0; // Include additional price adjustments per item
      return total + (item.price + additionalPrice) * quantity; // Adjust total price calculation
    }, 0);
  }

  updatePrice(index: number, priceChange: number, event: Event) {
    const input = event.target as HTMLInputElement; // Cast event.target
    const isChecked = input.checked; // Access checked property safely

    if (isChecked) {
      this.orderItems[index].additionalPrice =
        (this.orderItems[index].additionalPrice || 0) + priceChange; // Increment additional price if checked
    } else {
      this.orderItems[index].additionalPrice! -= priceChange; // Decrement additional price if unchecked
    }
  }

  showToast(toastId: string) {
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
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
    // Először távolítsd el az elemet a rendelésből
    this.orderService.removeFromOrder(index);
    this.orderItems = this.orderService.getOrderItems();

    // Ezután távolítsd el a megfelelő elemet a FormArray-ból
    this.items.removeAt(index);

    // Frissítsd a FormArray-ot
    this.populateOrderItems();
  }

  private updateAvailableTimes(selectedDate: Date) {
    const dayOfWeek = selectedDate.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

    // Opening hours for each day of the week
    const openingHours: { [key: number]: string[] } = {
      0: [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
      ], // Sunday (Vasárnap)
      1: [
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
      ], // Monday (Hétfő)
      2: [
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
      ], // Tuesday (Kedd)
      3: [
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
      ], // Wednesday (Szerda)
      4: [
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
      ], // Thursday (Csütörtök)
      5: [
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
      ], // Friday (Péntek)
      6: [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
      ], // Saturday (Szombat)
    };

    this.availableTimes = openingHours[dayOfWeek] || [];
  }
  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private convertToTimeFormat(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
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
      .map((item, index) => {
        const quantity = this.items.at(index).get('quantity')?.value || 1; // Biztosítja a mennyiséget
        const calculatedPrice = item.price * quantity; // Dinamikus ár kiszámítása
        return `\nTorta megnevezése: ${
          item.name
        }\nSzeletek száma: ${quantity}\nMegjegyzés: ${
          item.comment || 'Nincs megadva'
        }\nÁr: ${calculatedPrice.toLocaleString('hu-HU')} Ft\n`; // Ár hozzáadása
      })
      .join('\n'); // Join items with a newline for better separation

    // Összesített ár
    const totalPrice = this.totalPrice;

    // E-mail küldése az összes tételről
    const emailData = {
      to: 'bagettos@gmail.com',
      subject: `Rendelés ${this.orderForm.value.name} ${this.orderForm.value.date} ${this.orderForm.value.time}`,
      body: `
        Kedves Mókusch Café!\n
        ${
          this.orderForm.value.name
        } vagyok és az alábbi termékeket szeretném kérni tőletek a ${
        this.orderForm.value.date
      } dátumra, ${this.orderForm.value.time} órára ${
        this.orderForm.value.deliveryMethod
      } átvételi módon.\n\n
        Adataim:\n
        E-mail: ${this.orderForm.value.email}\n
        Név: ${this.orderForm.value.name}\n
        Telefonszám: ${this.orderForm.value.phone}\n
        Üzenet: ${this.orderForm.value.message}\n\n
        Rendelés részletei:\n
        ${orderDetails}\n
        Összesen: ${totalPrice.toLocaleString('hu-HU')} Ft\n
        Köszönöm,\n
        ${this.orderForm.value.name}
      `,
    };

    this.http
      .post('https://mokusch-cafe-backend.onrender.com/send-email', emailData)
      .subscribe({
        next: (_response) => {
          this.showToast('liveToastSuccess'); // Show success toast
          this.orderService.clearOrder(); // Clear the cart
        },
        error: (_error) => {
          this.showToast('liveToastError'); // Show error toast
        },
        complete: () => {
          console.log('Email küldés befejezve.');
        },
      });
  }
}
