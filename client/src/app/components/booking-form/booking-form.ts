import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  // Dynamic lists from backend
  directionalDays: any[] = [];
  weekdays: string[] = [];
  timeSlots: string[] = [];
  pickupLocations: string[] = [];
  destinations: string[] = [];
  originalPickupLocations: string[] = [];
  originalDestinations: string[] = [];

  universities = [
    'الجامعة المصرية اليابانية',
    'جامعة العلمين الدولية',
    'جامعة المنوفية الأهلية',
    'جامعة دمنهور الأهلية'
  ];

  constructor(private http: HttpClient, public lang: TranslationService) { }

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
    }
    this.validate();
  }

  fetchUniversitySettings(uniId: string) {
    this.http.get<{ success: boolean, data: any }>(`${API_URL}/api/settings/${uniId}`)
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.originalPickupLocations = res.data.pickupLocations || [];
            this.originalDestinations = res.data.destinations || (res.data.destination ? [res.data.destination] : ['السكن الجامعي HQ']);
            this.directionalDays = (res.data.directionalDays || []).filter((d: any) => d.active);
            this.weekdays = this.directionalDays.map(d => d.name);

            // Reset fields
            this.pickupLocations = [...this.originalPickupLocations];
            this.destinations = [...this.originalDestinations];
            this.formData.weekday = '';
            this.formData.timeSlot = '';
            this.formData.departureTo = '';
            this.formData.departureFrom = '';
          }
        },
        error: (err) => console.error('Failed to load settings', err)
      });
  }

  onDayChange() {
    const selectedDay = this.directionalDays.find(d => d.name === this.formData.weekday);
    if (selectedDay) {
      this.timeSlots = selectedDay.times || [];
      this.formData.timeSlot = '';

      if (selectedDay.direction === 'go') {
        this.pickupLocations = [...this.originalPickupLocations];
        this.destinations = [...this.originalDestinations];
        this.formData.departureFrom = '';
        this.formData.departureTo = this.originalDestinations.length > 0 ? this.originalDestinations[0] : '';
      } else if (selectedDay.direction === 'return') {
        this.pickupLocations = [...this.originalDestinations];
        this.destinations = [...this.originalPickupLocations];
        this.formData.departureFrom = this.originalDestinations.length > 0 ? this.originalDestinations[0] : '';
        this.formData.departureTo = '';
      }
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
