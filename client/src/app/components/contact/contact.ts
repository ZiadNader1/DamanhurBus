import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './contact.html',
    styleUrl: './contact.css'
})
export class ContactComponent {
    whatsappGroups = [
        { name: 'البحيرة', link: 'https://chat.whatsapp.com/KWne4THix6D1UjAB3mSba6' },
        { name: 'كفر الشيخ', link: 'https://chat.whatsapp.com/F0nZ8Pz89h47w5mAfWu4DE' },
        { name: 'بورسعيد ودمياط', link: 'https://chat.whatsapp.com/Hh2DIVWqX53LGaqNgpizY9?mode=gi_t' }
    ];
    phoneNumber = '01067465956';

    constructor(public lang: TranslationService) { }

    openWhatsApp(link: string) {
        window.open(link, '_blank');
    }

    callPhone() {
        window.location.href = `tel:${this.phoneNumber}`;
    }
}
