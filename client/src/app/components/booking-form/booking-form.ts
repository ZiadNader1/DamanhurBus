import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { API_URL } from '../../api-config';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm implements OnInit {
  @Input() preselectedUniversity = '';

  universityNames: Record<string, string> = {
    'ejust': 'الجامعة المصرية اليابانية',
    'alamein': 'جامعة العلمين الدولية',
    'menofia': 'جامعة المنوفية الأهلية',
    'damanhour-ahlia': 'جامعة دمنهور الأهلية'
  };

  formData = {
    weekday: '',
    timeSlot: '',
    university: '',
    departureFrom: '',
    departureTo: 'السكن الجامعي HQ',
    fullName: '',
    phoneNumber: ''
  };

  errors = signal<any>({});
  loading = signal(false);
  success = signal(false);

  // Dynamic lists from backend - using signals for reactivity
  directionalDays = signal<any[]>([]);
  timeSlots = signal<string[]>([]);
  pickupLocations = signal<string[]>([]);
  destinations = signal<string[]>([]);

  originalPickupLocations: string[] = [];
  originalDestinations: string[] = [];

  universities = computed(() => {
    return this.lang.isArabic()
      ? ['الجامعة المصرية اليابانية', 'جامعة العلمين الدولية', 'جامعة المنوفية الأهلية', 'جامعة دمنهور الأهلية']
      : ['E-JUST', 'Alamein International University', 'Menofia Ahlia University', 'Damanhour Ahlia University'];
  });

  // Computed for UX - Groups days by their name (Sat, Sun...)
  groupedDays = computed(() => {
    const days = this.directionalDays();
    const groups: Record<string, any[]> = {};
    days.forEach(d => {
      const parts = d.name.split(' ');
      const name = parts[0];
      if (!groups[name]) groups[name] = [];
      groups[name].push(d);
    });
    return Object.entries(groups).map(([name, options]) => ({ name, options }));
  });

  constructor(
    private http: HttpClient,
    public lang: TranslationService,
    private cdr: ChangeDetectorRef
  ) { }

  universityIds: Record<string, string> = {
    'الجامعة المصرية اليابانية': 'ejust',
    'جامعة العلمين الدولية': 'alamein',
    'جامعة المنوفية الأهلية': 'menofia',
    'جامعة دمنهور الأهلية': 'damanhour-ahlia',
    'E-JUST': 'ejust',
    'Alamein International University': 'alamein',
    'Menofia Ahlia University': 'menofia',
    'Damanhour Ahlia University': 'damanhour-ahlia'
  };

  ngOnInit() {
    if (this.preselectedUniversity) {
      this.formData.university = this.universityNames[this.preselectedUniversity] || '';
      this.fetchUniversitySettings(this.preselectedUniversity);
    }
  }

  onUniversityChange() {
    const uniId = this.universityIds[this.formData.university];
    if (uniId) {
      this.fetchUniversitySettings(uniId);
    } else {
      // Clear data if no uni selected
      this.directionalDays.set([]);
      this.pickupLocations.set([]);
      this.destinations.set([]);
    }
    this.validate();
  }

  selectUniversity(uni: string) {
    this.formData.university = uni;
    this.onUniversityChange();
  }

  fetchUniversitySettings(uniId: string) {
    this.http.get<{ success: boolean, data: any }>(`${API_URL}/api/settings/${uniId}`)
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.originalPickupLocations = res.data.pickupLocations || [];
            this.originalDestinations = res.data.destinations || [];
            this.directionalDays.set((res.data.directionalDays || []).filter((d: any) => d.active));

            // Reset fields to what's EXACTLY in the dashboard (No swapping/auto-selection)
            this.pickupLocations.set([...this.originalPickupLocations]);
            this.destinations.set([...this.originalDestinations]);

            this.formData.weekday = '';
            this.formData.timeSlot = '';
            this.formData.departureTo = '';
            this.formData.departureFrom = '';
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error('Failed to load settings', err)
      });
  }

  onDayChange() {
    const selectedDay = this.directionalDays().find(d => d.name === this.formData.weekday);
    if (selectedDay) {
      this.timeSlots.set(selectedDay.times || []);
      this.formData.timeSlot = '';

      // Automatic swapping and field pre-filling has been removed to give 
      // the user full control over the selection lists from the dashboard.
      this.cdr.detectChanges();
    }
    this.validate();
  }

  selectDay(day: any) {
    this.formData.weekday = day.name;
    this.onDayChange();
  }

  selectTime(time: string) {
    this.formData.timeSlot = time;
    this.validate();
  }

  selectFrom(loc: string) {
    this.formData.departureFrom = loc;
    this.validate();
    this.cdr.detectChanges();
  }

  selectTo(dest: string) {
    this.formData.departureTo = dest;
    this.validate();
    this.cdr.detectChanges();
  }

  validate() {
    const newErrors: any = {};
    if (!this.formData.weekday) newErrors.weekday = this.lang.t('err_day');
    if (!this.formData.timeSlot) newErrors.timeSlot = this.lang.t('err_time');
    if (!this.formData.university) newErrors.university = this.lang.t('err_university');
    if (!this.formData.departureFrom) newErrors.departureFrom = this.lang.t('err_from');
    if (!this.formData.departureTo) newErrors.departureTo = this.lang.t('err_to');
    if (!this.formData.fullName) newErrors.fullName = this.lang.t('err_name');

    const phoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;
    if (!this.formData.phoneNumber) {
      newErrors.phoneNumber = this.lang.t('err_phone');
    } else if (!phoneRegex.test(this.formData.phoneNumber)) {
      newErrors.phoneNumber = this.lang.t('err_phone_invalid');
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  onSubmit() {
    if (!this.validate()) return;

    this.loading.set(true);
    this.http.post(`${API_URL}/api/booking`, this.formData)
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.success.set(true);
          this.resetForm();
        },
        error: (err) => {
          this.loading.set(false);
          alert(this.lang.isArabic() ? 'حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.' : 'An error occurred during booking. Please try again.');
        }
      });
  }

  resetForm() {
    const university = this.formData.university;
    const dest = this.formData.departureTo;
    this.formData = {
      weekday: '',
      timeSlot: '',
      university: this.preselectedUniversity ? university : '',
      departureFrom: '',
      departureTo: '',
      fullName: '',
      phoneNumber: ''
    };
    this.errors.set({});
  }
}
