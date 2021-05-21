# Simple Appointment Scheduling

## Intro
This widget is built using HTML, CSS, (ES6) JavaScript and jQuery. The used Calendar library is [pg-calendar](https://github.com/KennethanCeyer/pg-calendar). Learn more about the [Spurwing Scheduling API](https://github.com/Spurwing/Appointment-Scheduling-API).

## Usage
- Upload the contents to an HTTP server and visit it.
- Select an available date on the calendar.
- Select a time slot, enter your name, email address and click submit.

## Configuration

`index.html`:
 - Variable `SpurwingPID`: **provider id**  from your Spurwing account.
 - Variable `SpurwingAPTID`: **appointment type id** from your Spurwing account. You can use an additional GET request to obtain it, or hard-code it.
 - Variable `SpurwingHookURL`: Optional URL to make a callback to when a user has submitted the booking.

`js/demo.js`:
 - Variable `show_months`: specify how many months to enable for booking (including the current month) on the calendar. This is purely an UI feature and independent from your Spurwing settings.

## Screenshot
![Simple Appointment Scheduling Demo](demo.png)
