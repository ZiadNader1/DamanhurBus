import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { API_URL } from '../../api-config';

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
    order: number;
}

interface UniversityConfig {
    universityId: string;
    universityName: string;
    pickupLocations: string[];
    timeSlots: string[];
    availableDays: string[];
    destinations: string[];
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
    loading = signal(false);

    selectedUni = signal('all');
    selectedDay = signal('all'); // ✅ New Filter

    today = new Date();
    editingBookingId: string | null = null;
    editingBookingData: any = {};
    editingAvailableTimes: string[] = [];

    // ✅ Get days available for the selected university
    availableDaysForFilter = computed(() => {
        const uni = this.selectedUni();
        if (uni === 'all') return ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
        const config = this.universityConfigs().find(c => c.universityName === uni);
        return config ? config.availableDays : [];
    });

    filteredBookings = computed(() => {
        const uni = this.selectedUni();
        const day = this.selectedDay();
        let all = this.bookings();

        if (uni !== 'all') {
            all = all.filter(b => b.university === uni);
        }
        if (day !== 'all') {
            all = all.filter(b => b.weekday === day);
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

    constructor(private http: HttpClient) { }

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
                    // ✅ Primary sort by order, then by date as fallback
                    const sorted = res.data.sort((a, b) => (a.order - b.order) || new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
                    this.bookings.set(sorted);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });

        // Fetch Settings
        this.http.get<{ success: boolean, data: UniversityConfig[] }>(`${API_URL}/api/settings`, { headers })
            .subscribe({
                next: (res) => this.universityConfigs.set(res.data),
                error: () => { }
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

    addLocation(config: UniversityConfig) {
        const loc = prompt('أدخل اسم نقطة التحرك الجديدة:');
        if (loc) {
            config.pickupLocations.push(loc);
        }
    }

    removeLocation(config: UniversityConfig, index: number) {
        config.pickupLocations.splice(index, 1);
    }

    addDay(config: UniversityConfig) {
        const day = prompt('أدخل اليوم الجديد (مثلاً: الجمعة):');
        if (day) {
            config.availableDays.push(day);
        }
    }

    removeDay(config: UniversityConfig, index: number) {
        config.availableDays.splice(index, 1);
    }

    addTime(config: UniversityConfig) {
        const time = prompt('أدخل الموعد الجديد (مثلاً: 09:00 AM):');
        if (time) {
            config.timeSlots.push(time);
        }
    }

    removeTime(config: UniversityConfig, index: number) {
        config.timeSlots.splice(index, 1);
    }

    addDestination(config: UniversityConfig) {
        const dest = prompt('أدخل الوجهة الجديدة:');
        if (dest) {
            if (!config.destinations) config.destinations = [];
            config.destinations.push(dest);
        }
    }

    removeDestination(config: UniversityConfig, index: number) {
        config.destinations.splice(index, 1);
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
        const config = this.universityConfigs().find(c => c.universityName === booking.university);
        this.editingAvailableTimes = config ? [...config.timeSlots] : [];
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
            timeSlot: this.editingBookingData.timeSlot,
            weekday: this.editingBookingData.weekday,
            departureFrom: this.editingBookingData.departureFrom,
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
        if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;

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

    exportToPNG() {
        const element = document.getElementById('printable-area');
        if (!element) return;

        html2canvas(element, {
            backgroundColor: '#0a0f1d',
            scale: 2,
            useCORS: true,
            logging: false,
            onclone: (clonedDoc) => {
                const noPrintElements = clonedDoc.querySelectorAll('.no-print');
                noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');

                const busTitles = clonedDoc.querySelectorAll('.bus-title');
                busTitles.forEach(el => {
                    const htmlEl = el as HTMLElement;
                    htmlEl.style.direction = 'rtl';
                    htmlEl.style.textAlign = 'right';
                    htmlEl.style.color = '#ffffff';
                    htmlEl.style.display = 'block';
                });
            }
        }).then(canvas => {
            const link = document.createElement('a');
            const date = new Date();
            const filename = `كشف-حجوزات-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.png`;
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
}
