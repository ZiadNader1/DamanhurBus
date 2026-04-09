import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { API_URL } from '../../api-config';
import { TranslationService } from '../../services/translation.service';

interface Governorate {
  _id: string;
  name: string;
  cities: string[];
  directionalDays?: any[];
  active: boolean;
}


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
    governorate: '',
    weekday: '',
    timeSlot: '',
    university: '',
    departureFrom: '',
    departureTo: 'السكن الجامعي HQ',
    travelPurpose: '',
    baggageDescription: '',
    fullName: '',
    phoneNumber: ''
  };

  errors = signal<any>({});
  loading = signal(false);
  success = signal(false);

  // Dynamic lists from backend - using signals for reactivity
  governorates = signal<Governorate[]>([]);
  timeSlots = signal<string[]>([]);

  activeUniversityConfig = signal<any>(null);
  selectedGovernorateId = signal<string>(''); // signal wrapper so computed() can track it

  activeGovernorateConfig = computed(() => {
    const govId = this.selectedGovernorateId();
    const govName = this.governorates().find(g => g._id === govId)?.name;
    const uniConfig = this.activeUniversityConfig();
    if (!govName || !uniConfig || !uniConfig.governorates) return null;
    return uniConfig.governorates.find((g: any) => g.governorateName === govName);
  });

  directionalDays = computed(() => {
    const govConf = this.activeGovernorateConfig();
    return govConf && govConf.directionalDays ? govConf.directionalDays.filter((d: any) => d.active) : [];
  });

  pickupLocations = computed(() => {
    const govConf = this.activeGovernorateConfig();
    return govConf && govConf.pickupLocations ? govConf.pickupLocations.filter((l: any) => l.active).map((l: any) => l.name) : [];
  });

  destinations = computed(() => {
    const govConf = this.activeGovernorateConfig();
    return govConf && govConf.destinations ? govConf.destinations.filter((d: any) => d.active).map((d: any) => d.name) : [];
  });

  get selectedDirection() {
    const dayName = this.formData.weekday;
    if (!dayName) return 'go';
    const day = this.directionalDays().find((d: any) => d.name === dayName);
    return day ? day.direction : 'go';
  }

  filteredPickupLocations = computed(() => {
    const direction = this.selectedDirection;
    if (direction === 'return') {
      return this.destinations();
    } else {
      return this.pickupLocations();
    }
  });

  filteredDestinations = computed(() => {
    const direction = this.selectedDirection;
    if (direction === 'return') {
      return this.pickupLocations();
    } else {
      return this.destinations();
    }
  });

  universities = computed(() => {
    return this.lang.isArabic()
      ? ['الجامعة المصرية اليابانية', 'جامعة العلمين الدولية', 'جامعة المنوفية الأهلية', 'جامعة دمنهور الأهلية']
      : ['E-JUST', 'Alamein International University', 'Menofia Ahlia University', 'Damanhour Ahlia University'];
  });

  // Computed for UX - Groups days by their name (Sat, Sun...)
  groupedDays = computed(() => {
    const days = this.directionalDays();
    const groups: Record<string, any[]> = {};
    days.forEach((d: any) => {
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
    this.fetchGovernorates();
    if (this.preselectedUniversity) {
      this.formData.university = this.universityNames[this.preselectedUniversity] || '';
      this.onUniversityChange();
    }
  }

  fetchGovernorates() {
    this.http.get<{ success: boolean, data: Governorate[] }>(`${API_URL}/api/governorates`)
      .subscribe({
        next: (res) => {
          this.governorates.set(res.data || []);
        },
        error: (err) => console.error('Failed to load governorates', err)
      });
  }

  onGovernorateChange() {
    this.formData.weekday = '';
    this.formData.timeSlot = '';
    this.formData.departureFrom = '';
    this.formData.departureTo = '';
    this.timeSlots.set([]);

    // Update the signal so computed properties react
    this.selectedGovernorateId.set(this.formData.governorate);

    // If university is already selected but settings not loaded yet, fetch now
    const uniId = this.universityIds[this.formData.university];
    if (uniId && !this.activeUniversityConfig()) {
      this.fetchUniversitySettings(uniId);
    }

    this.validate();
    this.cdr.detectChanges();
  }

  onUniversityChange() {
    const uniId = this.universityIds[this.formData.university];
    if (uniId) {
      this.fetchUniversitySettings(uniId);
    } else {
      this.activeUniversityConfig.set(null);
      this.onGovernorateChange();
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
            this.activeUniversityConfig.set(res.data);
            this.formData.departureTo = '';
            this.formData.departureFrom = '';
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error('Failed to load settings', err)
      });
  }

  onDayChange() {
    const selectedDay = this.directionalDays().find((d: any) => d.name === this.formData.weekday);
    if (selectedDay) {
      this.timeSlots.set(selectedDay.times || []);
      this.formData.timeSlot = '';
      this.formData.departureFrom = '';
      this.formData.departureTo = '';
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
    if (!this.formData.governorate) newErrors.governorate = this.lang.isArabic() ? 'يرجى اختيار المحافظة' : 'Please select governorate';
    if (!this.formData.weekday) newErrors.weekday = this.lang.t('err_day');
    if (!this.formData.timeSlot) newErrors.timeSlot = this.lang.t('err_time');
    if (!this.formData.university) newErrors.university = this.lang.t('err_university');
    if (!this.formData.departureFrom) newErrors.departureFrom = this.lang.t('err_from');
    if (!this.formData.departureTo) newErrors.departureTo = this.lang.t('err_to');
    if (!this.formData.travelPurpose) newErrors.travelPurpose = this.lang.isArabic() ? 'يرجى اختيار الغرض من السفر' : 'Please select travel purpose';
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
    
    // Resolve governorate name from the ID
    const govId = this.formData.governorate;
    const govName = this.governorates().find(g => g._id === govId)?.name || '';

    const payload = {
      ...this.formData,
      governorate: govName
    };

    this.http.post(`${API_URL}/api/booking`, payload)
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
      governorate: '',
      weekday: '',
      timeSlot: '',
      university: this.preselectedUniversity ? university : '',
      departureFrom: '',
      departureTo: '',
      travelPurpose: '',
      baggageDescription: '',
      fullName: '',
      phoneNumber: ''
    };
    this.errors.set({});
  }
}
