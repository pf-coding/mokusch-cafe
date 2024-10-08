import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { HeroCarouselComponent } from './main/hero-carousel/hero-carousel.component';
import { EmployeeCardsComponent } from './main/employee-cards/employee-cards.component';
import { CakeCatalogComponent } from './main/cake-catalog/cake-catalog.component';
import { AboutUsComponent } from './main/about-us/about-us.component';
import { CafemenuComponent } from './main/cafemenu/cafemenu.component';
import { FormsModule } from '@angular/forms';
import { OrderComponent } from './main/order/order.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    HeroCarouselComponent,
    EmployeeCardsComponent,
    CakeCatalogComponent,
    AboutUsComponent,
    CafemenuComponent,
    OrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
