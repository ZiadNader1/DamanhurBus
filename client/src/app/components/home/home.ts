import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingForm } from '../booking-form/booking-form';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookingForm],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
