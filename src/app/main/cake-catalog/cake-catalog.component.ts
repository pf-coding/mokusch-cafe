import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/services/translation-service.service';
import { CakeModel } from 'src/app/models/cake.model';
import { OrderService } from 'src/app/services/order-service.service';

@Component({
  selector: 'app-cake-catalog',
  templateUrl: './cake-catalog.component.html',
  styleUrls: ['./cake-catalog.component.scss'],
})
export class CakeCatalogComponent implements OnInit {
  cakes: CakeModel[] = [];
  paginatedCakes: CakeModel[] = [];
  selectedCakes: CakeModel[] = [];
  selectedCake: CakeModel | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  selectedTags: string[] = [];
  showAllTagsFlag: boolean = false;

  constructor(
    public translationService: TranslationService,
    public orderService: OrderService
  ) {}

  ngOnInit() {
    this.translationService.cakes$.subscribe((cakes) => {
      this.cakes = cakes;
      this.updatePagination(); // Update pagination whenever cakes are loaded
      this.updateSelectedCakes(); // Load selected cakes from order service
    });
  }

  selectCake(cake: CakeModel) {
    this.selectedCake = cake;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  get totalPages() {
    return Math.ceil(this.getFilteredCakes().length / this.itemsPerPage);
  }

  showAllTags() {
    this.showAllTagsFlag = !this.showAllTagsFlag;
  }

  filterByTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.updatePagination();
  }

  getFilteredCakes() {
    if (this.selectedTags.length === 0) {
      return this.cakes; // If no tags selected, show all cakes
    }
    return this.cakes.filter((cake) =>
      cake.tags.some((tag) => this.selectedTags.includes(tag))
    );
  }

  get popularTags() {
    const allTags = this.cakes.flatMap((cake) => cake.tags);
    const tagCounts: { [key: string]: number } = {};

    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const sortedTags = Object.keys(tagCounts).sort(
      (a, b) => tagCounts[b] - tagCounts[a]
    );
    return sortedTags.slice(0, 100);
  }

  changeLanguage(lang: 'hu' | 'en'): void {
    this.translationService.setLanguage(lang);
    this.updatePagination(); // Refresh the pagination when language changes
  }

  updateSelectedCakes() {
    // Update the cakes list to reflect the ones currently in the order
    this.cakes.forEach((cake) => {
      cake.selected = this.orderService
        .getOrderItems()
        .some((item) => item.id === cake.id); // assuming each cake has a unique id
    });
  }
  updatePagination() {
    const filteredCakes = this.getFilteredCakes();
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedCakes = filteredCakes.slice(start, start + this.itemsPerPage);
  }

  toggleSelection(cake: CakeModel) {
    const index = this.orderService.getOrderItems().findIndex(item => item.id === cake.id);

    if (index > -1) {
      // If the cake is already selected, remove it from order
      this.orderService.removeFromOrder(index);
    } else {
      // Only allow selection if it's not already in order
      this.orderService.addToOrder(cake);
    }
    this.updateSelectedCakes(); // Refresh the selected cakes status
    this.updatePagination(); // Refresh pagination
  }

  isSelected(cake: CakeModel): boolean {
    return this.orderService.getOrderItems().some(item => item.id === cake.id); // Check if the cake is selected
  }
}
