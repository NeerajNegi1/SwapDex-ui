import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCoinsModalComponent } from './crypto-coins-modal.component';

describe('CryptoCoinsModalComponent', () => {
  let component: CryptoCoinsModalComponent;
  let fixture: ComponentFixture<CryptoCoinsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoCoinsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoCoinsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
