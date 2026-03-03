import { Injectable, signal, computed } from '@angular/core';

type Lang = 'ar' | 'en';

const translations: Record<string, Record<Lang, string>> = {
    // Navbar
    nav_booking: { ar: 'الحجز', en: 'Booking' },
    nav_contact: { ar: 'تواصل', en: 'Contact' },
    nav_admin: { ar: 'لوحة التحكم', en: 'Admin Panel' },
    lang_toggle: { ar: 'EN', en: 'عربي' },

    // University Select Page
    hero_title: { ar: 'دمنهور باص', en: 'Damanhour Bus' },
    hero_subtitle: { ar: 'محطتك الأولى للجامعة — اختر جامعتك لحجز رحلتك', en: 'Your first stop to university — choose your university to book' },
    home_hero_title: { ar: 'محطتك الأولى للجامعة', en: 'Your First Stop to University' },
    home_subtitle: { ar: 'من دمنهور لمختلف الجامعات', en: 'From Damanhour to various universities' },
    book_now: { ar: 'احجز الآن', en: 'Book Now' },

    // Booking Page
    page_back_uni: { ar: 'اختر جامعة أخرى', en: 'Choose another university' },
    page_booking_sub: { ar: 'احجز مكانك في الرحلة القادمة', en: 'Book your seat for the next trip' },

    // Booking Form
    form_title: { ar: 'حجز رحلة جديدة', en: 'Book a New Trip' },
    form_subtitle: { ar: 'سجل بياناتك في خطوات بسيطة لضمان مكانك في الرحلة القادمة.', en: 'Fill in your details in simple steps to secure your seat on the next trip.' },
    form_day: { ar: 'اليوم والاتجاه', en: 'Day & Direction' },
    form_day_ph: { ar: 'اختر اليوم', en: 'Select Day' },
    form_time: { ar: 'موعد الرحلة', en: 'Trip Time' },
    form_time_ph: { ar: 'اختر الموعد المناسب', en: 'Select a time' },
    form_university: { ar: 'الجامعة', en: 'University' },
    form_university_ph: { ar: 'اختر جامعتك', en: 'Select your university' },
    form_from: { ar: 'نقطة التحرك (من)', en: 'Pickup Point (From)' },
    form_from_ph: { ar: 'حدد المحطة', en: 'Select station' },
    form_to: { ar: 'الوجهة (إلى)', en: 'Destination (To)' },
    form_name: { ar: 'الاسم المكتمل', en: 'Full Name' },
    form_name_ph: { ar: 'أدخل اسمك', en: 'Enter your name' },
    form_phone: { ar: 'رقم الهاتف (WhatsApp)', en: 'Phone Number (WhatsApp)' },
    form_submit: { ar: 'تأكيد الحجز الآن', en: 'Confirm Booking' },
    form_loading: { ar: 'جاري الحجز...', en: 'Booking...' },
    form_success: { ar: 'تم الحجز بنجاح! سنتواصل معك قريباً.', en: 'Booking confirmed! We will contact you soon.' },

    // Validation errors
    err_day: { ar: 'يرجى اختيار اليوم', en: 'Please select a day' },
    err_time: { ar: 'يرجى اختيار الموعد', en: 'Please select a time' },
    err_university: { ar: 'يرجى اختيار الجامعة', en: 'Please select a university' },
    err_from: { ar: 'يرجى اختيار مكان التحرك', en: 'Please select a pickup point' },
    err_to: { ar: 'يرجى اختيار الوجهة', en: 'Please select a destination' },
    err_name: { ar: 'يرجى إدخال الاسم بالكامل', en: 'Please enter your full name' },
    err_phone: { ar: 'يرجى إدخال رقم الهاتف', en: 'Please enter your phone number' },
    err_phone_invalid: { ar: 'يرجى إدخال رقم هاتف مصري صحيح', en: 'Please enter a valid Egyptian phone number' },

    // Contact Page
    contact_title: { ar: 'تواصل معنا', en: 'Contact Us' },
    contact_subtitle: { ar: 'نحن هنا للمساعدة في أي استفسار حول رحلتك', en: 'We are here to help with any inquiry about your trip' },
    contact_whatsapp: { ar: 'انضم لمجموعة الواتساب', en: 'Join our WhatsApp Group' },
    contact_whatsapp_sub: { ar: 'كن أول من يعرف بمواعيد الرحلات الجديدة والتحديثات', en: 'Be the first to know about new trip schedules and updates' },
    contact_join: { ar: 'الانضمام الآن', en: 'Join Now' },
    contact_back: { ar: 'العودة للرئيسية', en: 'Back to Home' },

    // Login Page
    login_title: { ar: 'لوحة تحكم المسؤول', en: 'Admin Dashboard' },
    login_subtitle: { ar: 'يرجى تسجيل الدخول للوصول للبيانات', en: 'Please sign in to access the data' },
    login_email: { ar: 'البريد الإلكتروني', en: 'Email' },
    login_password: { ar: 'كلمة المرور', en: 'Password' },
    login_btn: { ar: 'دخول النظام', en: 'Sign In' },
    login_loading: { ar: 'جاري التحقق...', en: 'Verifying...' },
    login_err_empty: { ar: 'يرجى إدخال جميع البيانات', en: 'Please fill in all fields' },
    login_err_wrong: { ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', en: 'Incorrect email or password' },
    login_err_server: { ar: 'فشل الاتصال بالخادم', en: 'Failed to connect to server' },

    // Dashboard
    dash_title: { ar: 'لوحة التحكم', en: 'Dashboard' },
    dash_bookings: { ar: 'الحجوزات', en: 'Bookings' },
    dash_settings: { ar: 'الإعدادات', en: 'Settings' },
    dash_list_title: { ar: 'قائمة الحجوزات', en: 'Bookings List' },
    dash_uni_settings: { ar: 'إعدادات الجامعات', en: 'University Settings' },
    dash_all_unis: { ar: 'كل الجامعات', en: 'All Universities' },
    dash_all_days: { ar: 'كل الأيام', en: 'All Days' },
    dash_refresh: { ar: 'تحديث', en: 'Refresh' },
    dash_export_png: { ar: 'تصدير PNG', en: 'Export PNG' },
    dash_clear_list: { ar: 'مسح القائمة', en: 'Clear List' },
    dash_th_name: { ar: 'الاسم', en: 'Name' },
    dash_th_time: { ar: 'الموعد', en: 'Time' },
    dash_th_pickup: { ar: 'التحرك', en: 'Pickup' },
    dash_th_phone: { ar: 'الهاتف', en: 'Phone' },
    dash_th_actions: { ar: 'التحكم', en: 'Actions' },
    dash_bus: { ar: 'باص', en: 'Bus' },
    dash_location: { ar: 'نقاط التحرك', en: 'Pickup Points' },
    dash_directional: { ar: 'أيام ومواعيد العمل', en: 'Schedule (Directional)' },
    dash_destinations: { ar: 'الوجهات', en: 'Destinations' },
    dash_add: { ar: 'إضافة', en: 'Add' },
    dash_save: { ar: 'حفظ التغييرات', en: 'Save Changes' },
    dash_choose_day: { ar: 'اختر اليوم والاتجاه', en: 'Choose Day & Direction' },
    dash_add_time: { ar: 'إضافة ميعاد', en: 'Add Time' },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
    private lang = signal<Lang>((localStorage.getItem('lang') as Lang) || 'ar');

    current = this.lang.asReadonly();

    isArabic = computed(() => this.lang() === 'ar');

    toggle() {
        const next: Lang = this.lang() === 'ar' ? 'en' : 'ar';
        this.lang.set(next);
        localStorage.setItem('lang', next);
        document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = next;
    }

    t(key: string): string {
        return translations[key]?.[this.lang()] ?? key;
    }
}
