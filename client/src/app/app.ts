import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { TranslationService } from './services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'client';
  constructor(public lang: TranslationService) {
    // Apply initial direction on page load
    document.documentElement.dir = lang.current() === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang.current();
  }
}
