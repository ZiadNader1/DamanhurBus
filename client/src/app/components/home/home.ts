import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingForm } from '../booking-form/booking-form';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookingForm],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor(public lang: TranslationService) { }
}
