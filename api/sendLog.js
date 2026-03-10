// api/sendLog.js
// Vercel Serverless Function for securely sending messages to Telegram
// Bot token and chat ID are stored as environment variables on the server

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the message text from the client
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  // Retrieve secrets from environment variables (stored on Vercel, not in code)
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing Telegram credentials in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Build Telegram Bot API URL
  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', data);
      return res.status(response.status).json({
        error: data.description || 'Telegram API error'
      });
    }

    // Success - return the Telegram response
    return res.status(200).json({
      success: true,
      message_id: data.result.message_id
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to send message to Telegram' });
  }
}
