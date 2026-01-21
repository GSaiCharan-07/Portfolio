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
- Server serves all static files (HTML, CSS, JS, images)
- Admin can view messages via /messages endpoint
- Error handling for form submissions
- No external dependencies required (uses only Node.js built-in modules)

## How to Use

1. Run `node server.js`
2. Visit http://localhost:3000
3. Fill out contact form on contact page
4. Messages are saved to messages.json
5. View messages at http://localhost:3000/messages
