import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-university-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './university-select.html',
    styleUrl: './university-select.css'
})
export class UniversitySelectComponent {

    universities = [
        {
            id: 'ejust',
            name: 'الجامعة المصرية اليابانية',
            nameEn: 'E-JUST',
            image: '/ejust-form.png',
        },
        {
            id: 'alamein',
            name: 'جامعة العلمين الدولية',
            nameEn: 'Alamein International University',
            image: '/alamein-form.png',
        },
        {
            id: 'menofia',
            name: 'جامعة المنوفية الأهلية',
            nameEn: 'Menofia Ahlia University',
            image: '/menofia-form.png',
        },
        {
            id: 'damanhour-ahlia',
            name: 'جامعة دمنهور الأهلية',
            nameEn: 'Damanhour Ahlia University',
            image: '/damanhour-ahlia-form.png',
        }
    ];

    constructor(private router: Router) { }

    goToBooking(universityId: string) {
        this.router.navigate(['/booking', universityId]);
    }
}
