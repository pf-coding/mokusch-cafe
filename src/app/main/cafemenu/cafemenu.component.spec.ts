import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CafemenuComponent } from './cafemenu.component';

describe('CafemenuComponent', () => {
  let component: CafemenuComponent;
  let fixture: ComponentFixture<CafemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CafemenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CafemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
