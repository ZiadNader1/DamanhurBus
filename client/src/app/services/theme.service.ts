import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private theme = signal<Theme>((localStorage.getItem('theme') as Theme) || 'dark');

    current = this.theme.asReadonly();

    constructor() {
        // Sync with DOM on init
        effect(() => {
            const currentTheme = this.theme();
            document.body.classList.remove('light-mode', 'dark-mode');
            document.body.classList.add(`${currentTheme}-mode`);
            localStorage.setItem('theme', currentTheme);
        });
    }

    toggle() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    isDark() {
        return this.theme() === 'dark';
    }
}
