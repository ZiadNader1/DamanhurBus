import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingForm } from '../booking-form/booking-form';

interface UniversityConfig {
    name: string;
    image: string;
}

@Component({
    selector: 'app-booking-page',
    standalone: true,
    imports: [CommonModule, RouterLink, BookingForm],
    templateUrl: './booking-page.html',
    styleUrl: './booking-page.css'
})
export class BookingPageComponent implements OnInit {
    universityId = '';
    university: UniversityConfig | null = null;

    universities: Record<string, UniversityConfig> = {
        ejust: {
            name: 'الجامعة المصرية اليابانية',
            image: '/ejust-form.png'
        },
        alamein: {
            name: 'جامعة العلمين الدولية',
            image: '/alamein-form.png'
        },
        menofia: {
            name: 'جامعة المنوفية الأهلية',
            image: '/menofia-form.png'
        },
        'damanhour-ahlia': {
            name: 'جامعة دمنهور الأهلية',
            image: '/damanhour-ahlia-form.png'
        }
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.universityId = this.route.snapshot.paramMap.get('id') || '';
        this.university = this.universities[this.universityId] || null;
    }

    get backgroundImage() {
        return this.university ? `url('${this.university.image}')` : '';
    }
}
