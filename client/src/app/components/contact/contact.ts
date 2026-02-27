import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './contact.html',
    styleUrl: './contact.css'
})
export class ContactComponent {
    whatsappGroupLink = 'https://chat.whatsapp.com/KWne4THix6D1UjAB3mSba6';
    phoneNumber = '01067465956';

    openWhatsApp() {
        window.open(this.whatsappGroupLink, '_blank');
    }

    callPhone() {
        window.location.href = `tel:${this.phoneNumber}`;
    }
}
