export const receiverRoles = [
  { label: 'Admin', value: 'admin' },
  { label: 'CEO', value: 'ceo' },
  { label: 'O‘qituvchi', value: 'teacher' },
  { label: 'Talaba', value: 'student' },
  { label: 'Kasser', value: 'cacher' }
]

export const NOTIFICATIONS_HTML_TEMPLATE = `
<div style="margin: 20px auto; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; font-family: 'Segoe UI', sans-serif; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
  <div style="background-color: #00A34F; padding: 16px 24px; color: #ffffff; display: flex; align-items: center; gap: 12px;">
    <h2 style="margin: 0; font-size: 20px;">📢 O‘quv Markazlari Uchun Yangilik</h2>
  </div>
  <div style="padding: 24px; color: #111827; font-size: 16px; line-height: 1.6; text-align: center;">
  <img
    src="/images/icons/soffcrm.png"
    alt="SoffCRM Logo"
    style="height: 90px; border-radius: 6px; padding: 4px; object-fit: contain; margin-bottom: 16px;"
  />
  <p style="margin-top: 0;">Assalomu alaykum hurmatli o‘quv markazi vakillari,</p>
  <p>Dars jadvalida hech qanday o‘zgarish bo‘lmagan. Darslar 13-maydan belgilangan tartibda davom etadi. Iltimos, barcha talabalarga bu haqda xabar bering.</p>
  <p>Agar savollar bo‘lsa, tizim orqali bog‘lanishingiz mumkin.</p>
</div>
</div>
`
