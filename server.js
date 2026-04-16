import express from 'express';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SECRET_KEY = process.env.WEBHOOK_SECRET || '';

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
}

function esc(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.get('/', (_req, res) => {
  res.status(200).json({ ok: true, service: 'whatsapp-to-telegram-forwarder' });
});

app.post('/whatsapp', async (req, res) => {
  try {
    if (SECRET_KEY && req.get('x-webhook-secret') !== SECRET_KEY) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    const title = req.body?.title || req.body?.name || 'مرسل غير معروف';
    const text = req.body?.text || req.body?.message || '';
    const appName = req.body?.app || 'WhatsApp';
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Istanbul' });

    if (!text) {
      return res.status(400).json({ ok: false, error: 'missing text/message' });
    }

    const message = [
      '📩 <b>رسالة واتساب جديدة</b>',
      '',
      `📱 <b>التطبيق:</b> ${esc(appName)}`,
      `👤 <b>الاسم:</b> ${esc(title)}`,
      `💬 <b>الرسالة:</b> ${esc(text)}`,
      `🕒 <b>الوقت:</b> ${esc(timestamp)}`
    ].join('\n');

    const tgResp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const tgJson = await tgResp.json();
    if (!tgResp.ok || !tgJson.ok) {
      return res.status(502).json({ ok: false, telegram: tgJson });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
