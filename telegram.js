// telegram.js
// Client-side module for sending logs to server-side API
// The actual Telegram bot token and chat ID are stored on the Vercel server

/**
 * Send a message via server-side API (secure, token hidden on server).
 *
 * @param {string} text - The text to send
 * @returns {Promise<object>} - The server API response JSON
 */
async function sendLog(text) {
    const url = '/api/sendLog';
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`API error: ${resp.status} ${errText}`);
    }
    return resp.json();
}

// Expose sendLog globally for use in inline scripts
if (typeof window !== 'undefined') {
    window.sendLog = sendLog;
}

// Export for Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendLog };
}
