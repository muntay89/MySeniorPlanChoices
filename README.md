# MySeniorPlanChoices

**Full-stack Medicare insurance website with appointment scheduling, real-time availability, automated email confirmations, and lead-generation functionality.**

🌐 **Live Website:** https://myseniorplanchoices.com/

## Overview

MySeniorPlanChoices is a full-stack website developed for a licensed Medicare insurance agent serving clients throughout Orange County, Los Angeles County, and San Bernardino County.

The project was built to provide more than a traditional informational landing page. It gives prospective clients a streamlined way to learn about Medicare services, contact the agent, view appointment availability, and schedule consultations directly through the website.

The application combines a responsive frontend with a PHP/MySQL backend to support appointment scheduling, database persistence, email communication, and administrative appointment management.

## Key Features

### Dynamic Appointment Scheduling

Users can schedule consultations directly through an interactive booking interface.

* Interactive date selection using **Flatpickr**
* Retrieves available appointment times dynamically from the backend
* Removes already-booked time slots from availability
* Validates appointment information before submission
* Stores confirmed appointments in a MySQL database
* Handles booking conflicts when a time slot becomes unavailable
* Refreshes availability immediately after a successful booking

### Automated Email Confirmations

The booking system integrates **PHPMailer** with SMTP to automatically send appointment confirmation emails.

After a successful reservation:

* The client receives their appointment details by email
* Appointment date and time are included in the confirmation
* The business receives a copy of the booking
* Email failures are handled separately so they do not invalidate a successful database reservation

### Contact & Lead Generation

The website includes a dedicated contact workflow for potential clients.

* Client-side form validation
* Required consent before submission
* Asynchronous form submission using the Fetch API
* Server-side email processing with PHP and PHPMailer
* Success and error feedback without requiring a page refresh

### Appointment Management

A protected administrative page allows the business to review submitted appointments.

The appointment view displays:

* Appointment date
* Appointment time
* Client name
* Email
* Phone number
* Booking timestamp

### Responsive Client-Focused UI

The frontend was designed around accessibility and simplicity for the site's target audience.

The site includes:

* Responsive desktop and mobile layouts
* Smooth section navigation
* Clear call-to-action buttons
* Dedicated service explanations
* Medicare-related disclosures
* Contact information
* Interactive booking modals
* User-friendly success and error states

## Tech Stack

### Frontend

* **HTML5**
* **CSS3 / Sass**
* **JavaScript**
* **Fetch API**
* **jQuery**
* **Flatpickr**
* **Font Awesome**

### Backend

* **PHP**
* **PDO**
* **MySQL**
* **PHPMailer**
* **SMTP**

### Deployment

* **InfinityFree**
* Custom domain and SSL configuration

## Architecture

The application uses a lightweight client-server architecture.

```text
Browser
   │
   ├── HTML / CSS / JavaScript
   │
   ├── Contact Form
   │       │
   │       └── send-email.php
   │               │
   │               └── PHPMailer / SMTP
   │
   └── Appointment Scheduler
           │
           ├── available.php
           │       │
           │       └── MySQL
           │
           └── book.php
                   │
                   ├── MySQL
                   │
                   └── PHPMailer / SMTP
```

## Booking Workflow

The appointment system was one of the primary engineering features of the project.

1. The user selects a date through the calendar interface.
2. JavaScript requests available appointment times from `available.php`.
3. PHP queries the MySQL database for appointments already scheduled on that date.
4. Previously booked times are removed from the returned availability.
5. The user enters their contact information and selects a time.
6. JavaScript sends the reservation to `book.php` as JSON.
7. PHP validates the submitted data and attempts to create the appointment.
8. The appointment is stored in MySQL.
9. An email confirmation is sent through PHPMailer.
10. The frontend refreshes available time slots without reloading the page.

This architecture keeps scheduling data synchronized with the database while providing a responsive user experience.

## Project Structure

```text
MySeniorPlanChoices/
│
├── index.html
│
├── available.php
├── book.php
├── send-email.php
├── appointments.php
├── db.php
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── sass/
│   ├── webfonts/
│   └── phpmailer/
│
└── images/
```

### Important Backend Files

| File               | Purpose                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `available.php`    | Queries existing appointments and returns available scheduling times |
| `book.php`         | Validates and creates appointments and triggers confirmation emails  |
| `send-email.php`   | Processes contact form submissions                                   |
| `db.php`           | Establishes the application's PDO database connection                |
| `appointments.php` | Provides a protected interface for reviewing appointments            |

## Engineering Highlights

### Database-Driven Availability

Instead of relying on hardcoded frontend availability alone, the application checks the database whenever a user selects a date. This prevents already-reserved appointments from continuing to appear as available.

### Asynchronous Frontend Communication

The appointment and contact systems use JavaScript's Fetch API to communicate with PHP endpoints without requiring full-page reloads.

This provides a smoother experience while keeping frontend presentation separate from backend processing.

### Prepared SQL Statements

Database operations use **PDO prepared statements** rather than constructing SQL queries directly from user input.

### Server-Side Validation

Booking information is validated by the PHP backend even when validation has already occurred in the browser, ensuring the server does not depend solely on client-side validation.

### Graceful Error Handling

The booking workflow distinguishes between several failure conditions, including:

* Missing required information
* Invalid email addresses
* Unavailable appointment times
* Database errors
* Network errors
* Email delivery failures

### Real-World Business Requirements

The website was developed around the needs of an actual insurance business rather than around a predefined tutorial or sample application.

This required balancing:

* Technical functionality
* Ease of use
* Responsive design
* Business lead generation
* Appointment management
* Medicare disclosures
* Client communication

## What I Learned

Building MySeniorPlanChoices gave me experience developing and deploying a complete web application outside of a classroom environment.

Some of the primary areas I worked with included:

* Designing frontend and backend components together
* Building PHP endpoints consumed by browser JavaScript
* Persisting user-generated data with MySQL
* Working with PDO and prepared statements
* Designing database-backed scheduling logic
* Integrating third-party email services
* Handling asynchronous HTTP requests
* Implementing frontend and server-side validation
* Debugging differences between local and production environments
* Deploying and maintaining a live website
* Translating client requirements into working software

## Future Improvements

Potential improvements include:

* Migrating configuration and credentials to environment variables
* Replacing basic administrator authentication with session-based authentication
* Adding appointment cancellation and rescheduling
* Building a complete administrative dashboard
* Adding automated reminder emails
* Improving server-side contact form validation
* Adding CSRF protection
* Adding rate limiting and spam prevention
* Expanding appointment-management functionality
* Adding automated tests for booking endpoints

## Author

**Monte Bradford**

Computer Science Student
California State University, Fullerton

Interested in **Software Engineering, Backend Development, and Full-Stack Development**.
