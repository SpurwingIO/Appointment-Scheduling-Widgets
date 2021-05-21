# Appointment Scheduling 

## Intro

This set of widgets are built with HTML, CSS, JavaScript and jQuery with the supporting library [tui.date-picker](https://github.com/nhn/tui.date-picker). Learn more about the [Spurwing Scheduling API](https://github.com/Spurwing/Appointment-Scheduling-API).

## Usage

- Upload the contents to an HTTP server 
> Clients: 
>>1. Visit example04-having-timepicker.html 
>>2. Select desired appointment time.
>>3. Enter name, email address and click submit.

>>Demo:![demo](http://g.recordit.co/4kjsyBm6lX.gif) 

>Providers:
>> Generate html for email:
>> 1. Visit "htmlGenerator.html".
>> 2. Select one appointment type and appointment time(s) you would like to provide to clients.
>> 3. Uncheck time option(s) if you no longer want to display it/them to clients, and click "Generate html".
>> 4. Click "Copy html" to copy the html content to the clipboard.

>> Demo:![demo](http://g.recordit.co/IvDrW98F03.gif)

>> 5. Paste the content to email, and send it to client.
>> 6. Clients will then be able to click on the the desired appointment time in the email and enter their information as mentioned above.(If by the time, selected appointment time is no longer available, the web page will display the message, and ask client to pick another time from email.)
>> Demo:![demo](http://g.recordit.co/11m6nTCw9l.gif)


## Configuration
`calendar.js`:
- Variable `SpurwingPID`:  **provider id**  from your Spurwing account.
`htmlGenerator.js`:
- Variable `SpurwingPID`:  **provider id**  from your Spurwing account.
- Variable `url`: **hostname** of this application folder (For example, if you are hosting folder at localhost, you can replace url variable with "http://[::]").