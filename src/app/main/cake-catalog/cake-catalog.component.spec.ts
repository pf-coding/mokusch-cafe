import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeCatalogComponent } from './cake-catalog.component';

describe('CakeCatalogComponent', () => {
  let component: CakeCatalogComponent;
  let fixture: ComponentFixture<CakeCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CakeCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CakeCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
