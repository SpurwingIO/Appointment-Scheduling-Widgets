# QR code widgets
This directory is for QR code related projects.

![business card with qr code](https://user-images.githubusercontent.com/9488406/115966027-1090c800-a52c-11eb-824c-def787546d50.png)

## Intro
QR codes allow us to embed/encode information as an image, which we all know as this large square filled with smaller black and white squares. The science and math behind QR codes isn't very easy, but there are a ton of articles and videos on YouTube that explain the process.

All modern phones have a built-in QR Code Scanner which decodes the information. If the encoded data was just text, your phone will show the message, but if it's an URL then it will prompt you to open it in the browser. It's a great way to promote your website or project. But we can also use it for embedding email addresses or special app events.

## Generating QR codes
The file `index.html` contains JavaScript code which can encode plain text into a QR code. [Live demo here](https://spurwingio.github.io/Appointment-Scheduling-Widgets/QRCode/)

![image](https://user-images.githubusercontent.com/9488406/115966685-0a501b00-a52f-11eb-8c57-db2d6ba9dc26.png)

The default settings allow you to encode 62 characters, which is usally enough for a simple URL or message.
If you need to encode longer texts you can tweek the settings (`version` and `ECL`) using this [reference sheet](https://www.qrcode.com/en/about/version.html). The library we used for QR code generation is this one.

## Bookings with QR codes
Since QR codes can encode URLs, we can encode a link pointing to our Appointment Scheduling or Availability Page. For instance our page on Spurwing which allows users to book a demo call: https://www.spurwing.io/contact

Similarly you can encode your email address as such `mailto:ilya@spurwing.io` When scanning that QR code your device will prompt you to open the Email app with your email in the recipient field.

## Conclusion
QR codes are a wonderful technological invention. Unfortunately they are not (yet) very common in the west, but in Asia they are used like crazy.
