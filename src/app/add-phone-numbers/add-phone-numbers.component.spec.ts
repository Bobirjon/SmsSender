import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhoneNumbersComponent } from './add-phone-numbers.component';

describe('AddPhoneNumbersComponent', () => {
  let component: AddPhoneNumbersComponent;
  let fixture: ComponentFixture<AddPhoneNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPhoneNumbersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhoneNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
