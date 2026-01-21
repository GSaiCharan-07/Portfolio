const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const nodemailer = require('nodemailer');
require('dotenv').config();

const PORT = 3000;

// Create email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// MIME types for static files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle viewing messages (for admin)
    if (req.method === 'GET' && pathname === '/messages') {
        const messagesFile = path.join(__dirname, 'messages.json');
        if (fs.existsSync(messagesFile)) {
            const data = fs.readFileSync(messagesFile, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
        }
        return;
    }

    // Handle contact form submission
    if (req.method === 'POST' && pathname === '/contact') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const formData = JSON.parse(body);
                const message = {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    timestamp: new Date().toISOString()
                };

                // Save to messages.json
                const messagesFile = path.join(__dirname, 'messages.json');
                let messages = [];

                if (fs.existsSync(messagesFile)) {
                    const data = fs.readFileSync(messagesFile, 'utf8');
                    messages = JSON.parse(data);
                }

                messages.push(message);
                fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

                // Send email
                const mailOptions = {
                    from: process.env.SMTP_USER,
                    to: process.env.TO_EMAIL,
                    subject: `New Contact Form Message: ${formData.subject}`,
                    html: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${formData.name}</p>
                        <p><strong>Email:</strong> ${formData.email}</p>
                        <p><strong>Subject:</strong> ${formData.subject}</p>
                        <p><strong>Message:</strong></p>
                        <p>${formData.message.replace(/\n/g, '<br>')}</p>
                        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        console.error('SMTP Config:', {
                            host: process.env.SMTP_HOST,
                            port: process.env.SMTP_PORT,
                            user: process.env.SMTP_USER ? '***' : 'NOT SET',
                            pass: process.env.SMTP_PASS ? '***' : 'NOT SET',
                            to: process.env.TO_EMAIL
                        });
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Error sending message' }));
                    } else {
                        console.log('Email sent:', info.response);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Message sent successfully!' }));
                    }
                });

            } catch (error) {
                console.error('Error processing form:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Error processing message' }));
            }
        });

        return;
    }

    // Serve static files
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        // Get file extension and set content type
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'text/plain';

        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1>');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Contact form messages will be saved to messages.json');
});
