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
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      deliveryMethod: ['', Validators.required],
      date: ['', Validators.required],
      time: [{ value: '', disabled: true }, Validators.required],
      message: [''],
      items: this.fb.array([]),
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

  onCheckboxChange(type: string, index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    if (isChecked) {
      // Ha az egyik checkbox be van pipálva, állítsuk be az additionalPrice értéket
      this.orderItems[index].additionalPrice =
        type === 'highDecorated' ? 100 : 200;
    } else {
      // Ha nincs bejelölve semmi, állítsuk alapértelmezett értékre
      this.orderItems[index].additionalPrice = 0;
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
        '17:30',
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

  submitOrder() {
    if (this.orderForm.invalid || this.orderItems.length === 0) {
      alert(
        'Kérlek, töltsd ki az összes szükséges mezőt és győződj meg róla, hogy van rendelés!'
      );
      return;
    }

    const orderDetails = this.orderItems
      .map((item, index) => {
        const quantity = this.items.at(index).get('quantity')?.value || 1; // Biztosítja a mennyiséget
        const calculatedPrice =
          (item.price + (item.additionalPrice || 0)) * quantity; // Dinamikus ár kiszámítása

        // Checkboxok címkéinek kiírása
        let highDecoratedLabel = '';
        let extraCoatingLabel = '';

        // Csak akkor adja hozzá a highDecoratedLabel-t, ha az unitOfMeasure 'szelet', és nem Piték vagy Mentes torták kategória
        if (
          item.unitOfMeasure === 'szelet' &&
          item.category !== 'Piték' &&
          item.category !== 'Mentes torták'
        ) {
          highDecoratedLabel =
            item.additionalPrice && item.additionalPrice > 0
              ? 'Magasított dísztortaként: Igen'
              : 'Magasított dísztortaként: Nem';
          extraCoatingLabel =
            item.additionalPrice && item.additionalPrice > 100
              ? 'Magasított dísztortaként extra bevonattal vagy díszítéssel: Igen'
              : 'Magasított dísztortaként extra bevonattal vagy díszítéssel: Nem';
        }

        return `
        <div class="order-card">
        <h3>${item.name}</h3>
        <p>${quantity} ${item.unitOfMeasure}</p>
        <p>Megjegyzés: ${item.comment || 'Nincs megadva'}</p>
        <p class="price">Ár: ${calculatedPrice.toLocaleString('hu-HU')} Ft</p>
        <p class="decorated-label">${highDecoratedLabel}</p>
        <p class="decorated-label">${extraCoatingLabel}</p>
      </div>
      `;
      })
      .join(''); // Join items without newline since we are using <p> tags

    // Összesített ár
    const totalPrice = this.totalPrice;

    // E-mail küldése az összes tételről
    const emailData = {
      to: `bagettos@gmail.com, ${this.orderForm.value.email}`,
      subject: `Mókusch rendelés ${this.orderForm.value.name} ${this.orderForm.value.date} ${this.orderForm.value.time}`,
      body: {
        orderForm: this.orderForm.value,
        orderDetails: orderDetails,
        totalPrice: totalPrice,
      },
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
