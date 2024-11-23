const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { Anthropic } = require('@anthropic-ai/sdk');
const config = require('./config');

// Initialize Claude client with the latest model
const anthropic = new Anthropic({
    apiKey: config.claudeApiKey,
});

// Initialize WhatsApp client with local auth strategy
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--disable-gpu'
        ],
        timeout: 60000,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    }
});

// Handle QR Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code with WhatsApp to start the bot');
});

// Handle ready state
client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

// Handle messages
client.on('message', async (message) => {
    // Log all messages for debugging
    console.log('Message Details:', {
        from: message.from,
        body: message.body,
        hasMedia: message.hasMedia,
        type: message.type,
        fromMe: message.fromMe,
        isGroup: message.isGroup
    });

    // Only respond to direct messages from others (not groups, not self)
    if (message.isGroup || message.fromMe) return;

    try {
        let messages = [{
            role: "user",
            content: message.body || "What's in this image?"
        }];

        // Handle image messages
        if (message.hasMedia && message.type === 'image') {
            const media = await message.downloadMedia();
            messages[0].content = [{
                type: "image",
                source: {
                    type: "base64",
                    media_type: media.mimetype,
                    data: media.data
                }
            }, {
                type: "text",
                text: message.body || "What's in this image?"
            }];
        }

        const response = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 1024,
            messages: messages
        });

        if (response.content && response.content[0].text) {
            await message.reply(response.content[0].text);
            console.log('Bot replied to message:', response.content[0].text);
        }

    } catch (error) {
        console.error('Error:', error);
        await message.reply('Sorry, I encountered an error processing your message.');
    }
});

// Add these error handlers
client.on('auth_failure', msg => {
    console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Add these error handlers after your existing event handlers
client.on('auth_failure', msg => {
    console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
});

// Initialize the client
client.initialize();