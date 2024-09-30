import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCardsComponent } from './main/employee-cards/employee-cards.component';
import { CakeCatalogComponent } from './main/cake-catalog/cake-catalog.component';
import { MainComponent } from './main/main.component';
import { CafemenuComponent } from './main/cafemenu/cafemenu.component';

const routes: Routes = [
  { path: 'employees', component: EmployeeCardsComponent },
  { path: 'cakes', component: CakeCatalogComponent },
  { path: 'cafemenu', component: CafemenuComponent },
  { path: '', component: MainComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
