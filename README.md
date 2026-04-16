# WhatsApp → Telegram Forwarder

هذا سيرفر بسيط يستقبل بيانات من Tasker على هاتفك ثم يرسلها إلى تيليجرام.

## Environment Variables
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `WEBHOOK_SECRET` (اختياري لكن مفضل)

## Endpoint
- `POST /whatsapp`

### Example JSON body
```json
{
  "app": "WhatsApp",
  "title": "أحمد",
  "text": "وينك؟"
}
```

## Deploy on Render
1. ارفع الملفات إلى GitHub.
2. من Render اختر New > Web Service واربط المستودع.
3. أضف متغيرات البيئة.
4. بعد النشر انسخ رابط الخدمة، وسيكون الويبهوك:
   `https://YOUR-SERVICE.onrender.com/whatsapp`

## Tasker setup
استخدم Event > Notification مع Owner Application = WhatsApp
ثم أرسل POST JSON إلى رابط الويبهوك.
