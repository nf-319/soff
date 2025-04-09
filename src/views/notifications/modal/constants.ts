import { NotificationItem } from './types';

export const generateFakeNotifications = (): NotificationItem[] => [
    {
      id: 1,
      notification: {
        id: 1,
        title: 'Tizimga xush kelibsiz',
        body: '<h3>Sizni ko\'rganingizdan xursandmiz!</h3><p>Ro\'yxatdan o\'tganingiz uchun rahmat. Endi siz platformamizning barcha imkoniyatlaridan foydalanishingiz mumkin.</p><img src="https://via.placeholder.com/600x300" alt="Xush kelibsiz" />',
        created_at: '2025-04-08T10:30:00',
        is_read: true,
        type: 'success'
      }
    },
    {
      id: 2,
      notification: {
        id: 2,
        title: 'Administratordan yangi xabar',
        body: '<p>Hurmatli foydalanuvchi,</p><p>Tizimda rejalashtirilgan texnik ishlar <strong>10 aprel soat 02:00 dan 04:00 gacha</strong> olib borilishi haqida xabar beramiz. Bu vaqt davomida xizmat ishlamasligi mumkin.</p><p>Hurmat bilan, Ma\'muriyat</p>',
        created_at: '2025-04-07T15:45:00',
        is_read: false,
        type: 'warning'
      }
    },
    {
      id: 3,
      notification: {
        id: 3,
        title: 'Tizim yangilanishi',
        body: '<h4>Versiya 2.5.1 chiqarildi!</h4><ul><li>Ish unumdorligi yaxshilandi</li><li>Xavfsizlik xatolari tuzatildi</li><li>Yangi funksiyalar qo\'shildi</li></ul><p>O\'zgarishlarni ko\'rish uchun sahifani qayta yuklang.</p>',
        created_at: '2025-04-06T09:15:00',
        is_read: false,
        type: 'info'
      }
    },
    {
      id: 4,
      notification: {
        id: 4,
        title: 'Uchrashiv haqida eslatma',
        body: '<p>Ertaga soat 14:00 da rejalashtirilgan uchrashiv haqida eslatma.</p><p>Mavzu: Choraklik hisobotni muhokama qilish</p><p>Joy: Onlayn (havola boshlashdan 15 daqiqa oldin yuboriladi)</p>',
        created_at: '2025-04-05T12:00:00',
        is_read: true,
        type: 'message'
      }
    },
    {
      id: 5,
      notification: {
        id: 5,
        title: 'Foydalanish shartlarining o\'zgarishi',
        body: '<h3>Hurmatli foydalanuvchilar!</h3><p>Sizni 2025 yil 15 maydan kuchga kiradigan xizmatdan foydalanish shartlarining o\'zgarishi haqida xabardor qilamiz.</p><p>Asosiy o\'zgarishlar:</p><ul><li>Maxfiylik siyosati</li><li>Ma\'lumotlarni saqlash qoidalari</li><li>Obuna shartlari</li></ul><p>O\'zgarishlarning to\'liq matni bilan tanishish uchun "Hujjatlar" bo\'limiga o\'ting.</p>',
        created_at: '2025-04-04T17:20:00',
        is_read: false,
        type: 'error'
      }
    }
  ];
