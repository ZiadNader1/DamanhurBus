import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../api-config';

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
  weekdays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  timeSlots: string[] = [];
  pickupLocations: string[] = [];
  destinations: string[] = ['السكن الجامعي HQ'];

  universities = [
    'الجامعة المصرية اليابانية',
    'جامعة العلمين الدولية',
    'جامعة المنوفية الأهلية',
    'جامعة دمنهور الأهلية'
  ];

  constructor(private http: HttpClient) { }

  universityIds: Record<string, string> = {
    'الجامعة المصرية اليابانية': 'ejust',
    'جامعة العلمين الدولية': 'alamein',
    'جامعة المنوفية الأهلية': 'menofia',
    'جامعة دمنهور الأهلية': 'damanhour-ahlia'
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
            this.timeSlots = res.data.timeSlots || [];
            this.pickupLocations = res.data.pickupLocations || [];
            this.weekdays = res.data.availableDays || ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
            this.formData.departureTo = res.data.destination || 'السكن الجامعي HQ';
            this.destinations = [this.formData.departureTo];
          }
        },
        error: (err) => console.error('Failed to load settings', err)
      });
  }

  validate() {
    const newErrors: any = {};
    if (!this.formData.weekday) newErrors.weekday = 'يرجى اختيار اليوم';
    if (!this.formData.timeSlot) newErrors.timeSlot = 'يرجى اختيار الموعد';
    if (!this.formData.university) newErrors.university = 'يرجى اختيار الجامعة';
    if (!this.formData.departureFrom) newErrors.departureFrom = 'يرجى اختيار مكان التحرك';
    if (!this.formData.departureTo) newErrors.departureTo = 'يرجى اختيار الوجهة';
    if (!this.formData.fullName) newErrors.fullName = 'يرجى إدخال الاسم بالكامل';

    const phoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;
    if (!this.formData.phoneNumber) {
      newErrors.phoneNumber = 'يرجى إدخال رقم الهاتف';
    } else if (!phoneRegex.test(this.formData.phoneNumber)) {
      newErrors.phoneNumber = 'يرجى إدخال رقم هاتف مصري صحيح';
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
          alert('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
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
      departureTo: dest,
      fullName: '',
      phoneNumber: ''
    };
    this.errors.set({});
  }
}
