import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CafeMenuItem } from 'src/app/models/cafe-menu-item.model';

@Component({
  selector: 'app-cafemenu',
  templateUrl: './cafemenu.component.html',
  styleUrls: ['./cafemenu.component.scss'],
})
export class CafemenuComponent implements OnInit {
  menuItems: CafeMenuItem[] = [];
  groupedMenuItems: { [key: string]: CafeMenuItem[] } = {};
  filteredMenuItems: CafeMenuItem[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.http
      .get<CafeMenuItem[]>('assets/menu-items.json')
      .subscribe((data) => {
        this.menuItems = data;
        this.groupByCategory();

      });
  }

  groupByCategory(): void {
    this.groupedMenuItems = this.menuItems.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {} as { [key: string]: CafeMenuItem[] });
  }

}
