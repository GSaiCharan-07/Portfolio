# Backend Implementation for Contact Form

## Completed Tasks

- [x] Created Node.js server (server.js) to handle static file serving and contact form submissions
- [x] Modified contact.html to send form data via AJAX to the backend instead of just showing success message
- [x] Added endpoint to save contact messages to messages.json file
- [x] Added admin endpoint (/messages) to view received messages
- [x] Created README.md with setup and usage instructions
- [x] Tested server startup successfully
- [x] Added email functionality to send contact form messages to your email

## Features Implemented

- Contact form now actually sends data to backend
- Messages are stored locally in messages.json with timestamp
- Messages are also sent to your email address
- Server serves all static files (HTML, CSS, JS, images)
- Admin can view messages via /messages endpoint
- Error handling for form submissions
- Email notifications for new contact form submissions

## Setup Instructions

1. Install dependencies:
   ```
   npm install nodemailer dotenv
   ```

2. Create a `.env` file in the root directory with your email configuration:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   TO_EMAIL=saicharangodavarthi7@gmail.com
   ```

3. For Gmail, enable 2FA and generate an app password.

## How to Use

1. Run `node server.js`
2. Visit http://localhost:3000
3. Fill out contact form on contact page
4. Messages are saved to messages.json and sent to your email
5. View messages at http://localhost:3000/messages
