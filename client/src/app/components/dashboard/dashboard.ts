import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { API_URL } from '../../api-config';
import { TranslationService } from '../../services/translation.service';

interface Booking {
    _id: string;
    fullName: string;
    phoneNumber: string;
    university: string;
    weekday: string;
    timeSlot: string;
    departureFrom: string;
    departureTo: string;
    bookingDate: string;
    governorate: string;
    order: number;
    travelPurpose?: string;
    baggageDescription?: string;
}

interface Governorate {
    _id: string;
    name: string;
    cities: string[];
    active: boolean;
}


interface DirectionalDay {
    id: string;
    name: string;
    direction: 'go' | 'return';
    active: boolean;
    times: string[];
}

interface GovernorateConfig {
    governorateName: string;
    pickupLocations: { name: string; active: boolean }[];
    destinations: { name: string; active: boolean }[];
    directionalDays: DirectionalDay[];
}

interface UniversityConfig {
    universityId: string;
    universityName: string;
    governorates: GovernorateConfig[];
}

interface GroupedBookings {
    busNumber: number;
    weekday: string;
    timeSlot: string;
    bookings: Booking[];
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
    isSidebarOpen = false;
    activeTab = 'bookings';
    bookings = signal<Booking[]>([]);
    universityConfigs = signal<UniversityConfig[]>([]);
    governorates = signal<Governorate[]>([]);
    loading = signal(false);

    selectedUni = signal('all');
    selectedDay = signal('all');
    selectedGov = signal('all'); // ✅ New Governorate Filter
    selectedTravelPurpose = signal('all'); // ✅ New Travel Purpose Filter

    today = new Date();
    editingBookingId: string | null = null;
    editingBookingData: any = {};
    editingAvailableTimes: string[] = [];

    activeGovPerUni: Record<string, string> = {};

    getActiveGovConfig(config: UniversityConfig): GovernorateConfig | undefined {
        const govName = this.activeGovPerUni[config.universityId];
        return config.governorates?.find(g => g.governorateName === govName);
    }

    ensureGovConfig(config: UniversityConfig, govName: string) {
        if (!config.governorates) config.governorates = [];
        const existing = config.governorates.find(g => g.governorateName === govName);
        if (!existing) {
            // Create default directional days for new governorate
            const defaultDays: DirectionalDay[] = [
                { id: 'sat-go', name: 'السبت ذهاب', direction: 'go', active: false, times: [] },
                { id: 'sat-return', name: 'السبت عودة', direction: 'return', active: false, times: [] },
                { id: 'sun-go', name: 'الأحد ذهاب', direction: 'go', active: false, times: [] },
                { id: 'sun-return', name: 'الأحد عودة', direction: 'return', active: false, times: [] },
                { id: 'mon-go', name: 'الاثنين ذهاب', direction: 'go', active: false, times: [] },
                { id: 'mon-return', name: 'الاثنين عودة', direction: 'return', active: false, times: [] },
                { id: 'tue-go', name: 'الثلاثاء ذهاب', direction: 'go', active: false, times: [] },
                { id: 'tue-return', name: 'الثلاثاء عودة', direction: 'return', active: false, times: [] },
                { id: 'wed-go', name: 'الأربعاء ذهاب', direction: 'go', active: false, times: [] },
                { id: 'wed-return', name: 'الأربعاء عودة', direction: 'return', active: false, times: [] },
                { id: 'thu-go', name: 'الخميس ذهاب', direction: 'go', active: false, times: [] },
                { id: 'thu-return', name: 'الخميس عودة', direction: 'return', active: false, times: [] },
                { id: 'fri-go', name: 'الجمعة ذهاب', direction: 'go', active: false, times: [] },
                { id: 'fri-return', name: 'الجمعة عودة', direction: 'return', active: false, times: [] }
            ];
            config.governorates.push({
                governorateName: govName,
                pickupLocations: [],
                destinations: [],
                directionalDays: defaultDays
            });
            // Re-trigger signal update
            this.universityConfigs.set([...this.universityConfigs()]);
        }
        this.activeGovPerUni[config.universityId] = govName;
    }

    // ✅ Get days available for the filter
    availableDaysForFilter = computed(() => {
        // Collect from university configs governorates
        const allDays = new Set<string>();
        this.universityConfigs().forEach(u => {
            u.governorates?.forEach(g => {
                g.directionalDays?.filter((d: DirectionalDay) => d.active).forEach((d: DirectionalDay) => allDays.add(d.name));
            });
        });
        return Array.from(allDays);
    });

    filteredBookings = computed(() => {
        const uni = this.selectedUni();
        const day = this.selectedDay();
        const gov = this.selectedGov();
        const purpose = this.selectedTravelPurpose();
        let all = this.bookings();

        if (uni !== 'all') {
            all = all.filter(b => b.university === uni);
        }
        if (day !== 'all') {
            all = all.filter(b => b.weekday === day);
        }
        if (gov !== 'all') {
            all = all.filter(b => b.governorate?.trim() === gov.trim());
        }
        if (purpose !== 'all') {
            all = all.filter(b => b.travelPurpose === purpose);
        }
        return all;
    });

    // ✅ Smart Grouping: Separates by Day and TimeSlot
    groupedBookings = computed(() => {
        const filtered = this.filteredBookings();
        const finalGroups: GroupedBookings[] = [];

        // 1. Get unique combinations of Day + TimeSlot present in filtered results
        const combinations = Array.from(new Set(filtered.map(b => `${b.weekday}|${b.timeSlot}`)));

        combinations.forEach(combo => {
            const [weekday, timeSlot] = combo.split('|');
            const bookingsInSlot = filtered.filter(b => b.weekday === weekday && b.timeSlot === timeSlot);

            // Sort bookings in this slot by their manual order
            const sortedByOrder = bookingsInSlot.sort((a, b) => a.order - b.order);

            // 2. Split people in this specific slot into buses (15 per bus)
            for (let i = 0; i < sortedByOrder.length; i += 15) {
                finalGroups.push({
                    busNumber: Math.floor(i / 15) + 1,
                    weekday,
                    timeSlot,
                    bookings: sortedByOrder.slice(i, i + 15)
                });
            }
        });

        return finalGroups;
    });

    constructor(private http: HttpClient, public lang: TranslationService) { }

    ngOnInit() {
        this.fetchData();
    }

    onUniChange(val: string) {
        this.selectedUni.set(val);
        this.selectedDay.set('all'); // Reset day when uni changes
    }

    onDayChange(val: string) {
        this.selectedDay.set(val);
    }

    onGovChange(val: string) {
        this.selectedGov.set(val);
    }

    onTravelPurposeChange(val: string) {
        this.selectedTravelPurpose.set(val);
    }

    fetchData() {
        this.loading.set(true);
        let token = localStorage.getItem('token');
        if (!token) {
            const user = localStorage.getItem('user');
            if (user) token = JSON.parse(user).token;
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        // Fetch Bookings
        this.http.get<{ success: boolean, data: Booking[] }>(`${API_URL}/api/booking`, { headers })
            .subscribe({
                next: (res) => {
                    // ✅ Sort: first registered = first in list (ascending by order, then by date for new bookings)
                    const sorted = res.data.sort((a, b) => {
                        const orderDiff = a.order - b.order;
                        if (orderDiff !== 0) return orderDiff;
                        return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
                    });
                    this.bookings.set(sorted);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });

        this.http.get<{ success: boolean, data: UniversityConfig[] }>(`${API_URL}/api/settings`, { headers })
            .subscribe({
                next: (res) => {
                    const sanitized = (res.data || []).map(config => {
                        return {
                            ...config,
                            governorates: (config.governorates || []).map((gov: any) => ({
                                ...gov,
                                pickupLocations: (gov.pickupLocations || []).map((l: any) =>
                                    typeof l === 'string' ? { name: l, active: true } : l
                                ),
                                destinations: (gov.destinations || []).map((d: any) =>
                                    typeof d === 'string' ? { name: d, active: true } : d
                                )
                            }))
                        };
                    });
                    this.universityConfigs.set(sanitized);
                    // Set initial active governorate per university
                    this.initActiveGovPerUni();
                },
                error: () => { }
            });

        // Fetch Governorates
        this.http.get<{ success: boolean, data: Governorate[] }>(`${API_URL}/api/governorates`, { headers })
            .subscribe({
                next: (res) => {
                    this.governorates.set(res.data || []);
                    // Re-initialize active gov per uni when governorates are loaded
                    this.initActiveGovPerUni();
                },
                error: () => { }
            });
    }

    initActiveGovPerUni() {
        const govs = this.governorates();
        const configs = this.universityConfigs();
        if (!configs.length) return;

        configs.forEach(config => {
            if (!this.activeGovPerUni[config.universityId]) {
                // Prefer first governorate from the Governorates collection
                if (govs.length > 0) {
                    this.activeGovPerUni[config.universityId] = govs[0].name;
                } else if (config.governorates && config.governorates.length > 0) {
                    // Fallback to first saved governorate config
                    this.activeGovPerUni[config.universityId] = config.governorates[0].governorateName;
                }
            }
        });
    }

    updateSetting(config: UniversityConfig) {
        let token = localStorage.getItem('token');
        if (!token) {
            const user = localStorage.getItem('user');
            if (user) token = JSON.parse(user).token;
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.put(`${API_URL}/api/settings/${config.universityId}`, config, { headers })
            .subscribe({
                next: () => {
                    alert('تم تحديث الإعدادات بنجاح');
                },
                error: (err) => {
                    alert('حدث خطأ أثناء التحديث: ' + (err.error?.message || err.message));
                }
            });
    }

    addLocationFromSelect(govConf: GovernorateConfig, city: string) {
        if (city && city.trim()) {
            govConf.pickupLocations.push({ name: city.trim(), active: true });
        }
    }

    addLocation(govConf: GovernorateConfig) {
        const loc = prompt(this.lang.isArabic() ? 'أدخل اسم نقطة التحرك الجديدة:' : 'Enter new pickup location:');
        if (loc) {
            govConf.pickupLocations.push({ name: loc, active: true });
        }
    }

    removeLocation(govConf: GovernorateConfig, index: number) {
        govConf.pickupLocations.splice(index, 1);
    }

    toggleLocation(loc: { name: string; active: boolean }) {
        loc.active = !loc.active;
    }

    addSpecificTime(govConf: GovernorateConfig, dayId: string, time24: string) {
        if (!dayId) {
            alert(this.lang.t('err_day'));
            return;
        }
        if (!time24) {
            alert(this.lang.t('err_time'));
            return;
        }

        // Convert 24h to 12h format
        const [hoursStr, minutesStr] = time24.split(':');
        let hours = parseInt(hoursStr, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const paddedHours = hours.toString().padStart(2, '0');
        const formattedTime = `${paddedHours}:${minutesStr} ${ampm}`;

        if (!govConf.directionalDays) govConf.directionalDays = [];
        const day = govConf.directionalDays.find(d => d.id === dayId);
        if (day) {
            if (!day.times) day.times = [];
            if (!day.times.includes(formattedTime)) {
                day.times.push(formattedTime);
            }
            day.active = day.times.length > 0;
        }
    }

    removeTime(day: DirectionalDay, index: number) {
        day.times.splice(index, 1);
        if (day.times.length === 0) {
            day.active = false;
        }
    }

    addDestinationFromSelect(govConf: GovernorateConfig, dest: string) {
        if (dest && dest.trim()) {
            if (!govConf.destinations) govConf.destinations = [];
            govConf.destinations.push({ name: dest.trim(), active: true });
        }
    }

    addDestination(govConf: GovernorateConfig) {
        const dest = prompt(this.lang.isArabic() ? 'أدخل الوجهة الجديدة:' : 'Enter new destination:');
        if (dest) {
            if (!govConf.destinations) govConf.destinations = [];
            govConf.destinations.push({ name: dest, active: true });
        }
    }

    removeDestination(govConf: GovernorateConfig, index: number) {
        govConf.destinations.splice(index, 1);
    }

    toggleDestination(dest: { name: string; active: boolean }) {
        dest.active = !dest.active;
    }

    // --- Governorates & Cities Management ---

    addGovernorate() {
        const title = prompt(this.lang.isArabic() ? 'أدخل اسم المحافظة:' : 'Enter Governorate Name:');
        if (!title) return;

        this.http.post(`${API_URL}/api/governorates`, { name: title }, { headers: this.getHeaders() })
            .subscribe({
                next: () => {
                    alert('تم إضافة المحافظة بنجاح');
                    this.fetchData();
                },
                error: (err) => alert('خطأ: ' + (err.error?.message || err.message))
            });
    }

    deleteGovernorate(id: string) {
        if (!confirm(this.lang.isArabic() ? 'هل أنت متأكد من حذف هذه المحافظة؟' : 'Are you sure you want to delete this governorate?')) return;
        this.http.delete(`${API_URL}/api/governorates/${id}`, { headers: this.getHeaders() })
            .subscribe({
                next: () => {
                    this.fetchData();
                },
                error: (err) => alert('خطأ: ' + (err.error?.message || err.message))
            });
    }

    updateGovernorate(gov: Governorate) {
        this.http.put(`${API_URL}/api/governorates/${gov._id}`, gov, { headers: this.getHeaders() })
            .subscribe({
                next: () => {
                    alert('تم الحفظ بنجاح');
                },
                error: (err) => alert('خطأ: ' + (err.error?.message || err.message))
            });
    }

    addCityToGovernorate(gov: Governorate) {
        const city = prompt(this.lang.isArabic() ? 'أدخل اسم المدينة الجديدة:' : 'Enter new city:');
        if (city && city.trim()) {
            if (!gov.cities) gov.cities = [];
            gov.cities.push(city.trim());
        }
    }

    removeCityFromGovernorate(gov: Governorate, index: number) {
        gov.cities.splice(index, 1);
    }

    moveBooking(bookingId: string, direction: 'up' | 'down') {
        const fullList = [...this.bookings()];
        const filteredList = this.filteredBookings();

        const currentIndex = filteredList.findIndex(b => b._id === bookingId);
        if (currentIndex === -1) return;

        let neighborIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (neighborIndex < 0 || neighborIndex >= filteredList.length) return;

        const currentBooking = filteredList[currentIndex];
        const neighborBooking = filteredList[neighborIndex];

        // Find their positions in the global list to swap
        const globalIdx1 = fullList.findIndex(b => b._id === currentBooking._id);
        const globalIdx2 = fullList.findIndex(b => b._id === neighborBooking._id);

        if (globalIdx1 !== -1 && globalIdx2 !== -1) {
            // Swap in global list
            [fullList[globalIdx1], fullList[globalIdx2]] = [fullList[globalIdx2], fullList[globalIdx1]];

            // Re-assign order values based on new positions to ensure persistence
            fullList.forEach((b, i) => b.order = i);

            this.bookings.set(fullList);
            this.saveOrder();
        }
    }

    startEditing(booking: Booking) {
        this.editingBookingId = booking._id || null;
        this.editingBookingData = { ...booking };
        this.editingBookingData.bookingDateLocal = this.toDatetimeLocal(booking.bookingDate);
        this.editingAvailableTimes = [];
    }

    toDatetimeLocal(dateStr: string): string {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    cancelEditing() {
        this.editingBookingId = null;
        this.editingBookingData = {};
        this.editingAvailableTimes = [];
    }

    saveEdit(bookingId: string | undefined) {
        if (!bookingId) return;

        let token = localStorage.getItem('token');
        if (!token) {
            const user = localStorage.getItem('user');
            if (user) token = JSON.parse(user).token;
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        const updatePayload = {
            fullName: this.editingBookingData.fullName,
            phoneNumber: this.editingBookingData.phoneNumber,
            timeSlot: this.editingBookingData.timeSlot,
            weekday: this.editingBookingData.weekday,
            departureFrom: this.editingBookingData.departureFrom,
            departureTo: this.editingBookingData.departureTo,
            travelPurpose: this.editingBookingData.travelPurpose,
            baggageDescription: this.editingBookingData.baggageDescription || '',
            bookingDate: this.editingBookingData.bookingDateLocal
                ? new Date(this.editingBookingData.bookingDateLocal).toISOString()
                : this.editingBookingData.bookingDate
        };

        this.http.put(`${API_URL}/api/booking/${bookingId}`, updatePayload, { headers })
            .subscribe({
                next: () => {
                    alert('تم تعديل الحجز بنجاح');
                    this.editingBookingId = null;
                    this.editingBookingData = {};
                    this.editingAvailableTimes = [];
                    this.fetchData();
                },
                error: (err) => {
                    console.error('Update Error:', err);
                    alert('حدث خطأ أثناء تعديل الحجز');
                }
            });
    }

    saveOrder() {
        let token = localStorage.getItem('token');
        if (!token) {
            const user = localStorage.getItem('user');
            if (user) token = JSON.parse(user).token;
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const orders = this.bookings().map((b, i) => ({ id: b._id, order: i }));

        this.http.put(`${API_URL}/api/booking/reorder`, { orders }, { headers })
            .subscribe({
                next: () => { },
                error: (err) => console.error('Failed to save order', err)
            });
    }

    private getToken() {
        let token = localStorage.getItem('token');
        if (!token) {
            const user = localStorage.getItem('user');
            if (user) token = JSON.parse(user).token;
        }
        return token;
    }

    private getHeaders() {
        return new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    }

    deleteBooking(id: string) {
        if (!confirm(this.lang.isArabic() ? 'هل أنت متأكد من حذف هذا الحجز؟' : 'Are you sure you want to delete this booking?')) return;

        this.http.delete(`${API_URL}/api/booking/${id}`, { headers: this.getHeaders() })
            .subscribe({
                next: () => {
                    this.fetchData();
                },
                error: (err) => alert('خطأ في الحذف: ' + err.message)
            });
    }

    clearList() {
        const uni = this.selectedUni();
        const day = this.selectedDay();

        let msg = 'هل أنت متأكد من مسح جميع الحجوزات؟';
        if (uni !== 'all' || day !== 'all') {
            msg = `هل أنت متأكد من مسح حجوزات (${uni === 'all' ? '' : uni} ${day === 'all' ? '' : day})؟`;
        }

        if (!confirm(msg)) return;

        this.http.post(`${API_URL}/api/booking/delete-bulk`,
            { university: uni, weekday: day },
            { headers: this.getHeaders() }
        ).subscribe({
            next: (res: any) => {
                alert(`تم حذف ${res.count} حجز بنجاح`);
                this.fetchData();
            },
            error: (err) => alert('خطأ في الحذف الجماعي: ' + err.message)
        });
    }

    exportToPDF() {
        window.print();
    }
}
