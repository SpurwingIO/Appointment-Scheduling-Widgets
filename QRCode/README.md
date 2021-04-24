# QR code widgets
This directory is for QR code related projects.

## Intro
QR codes allow us to embed/encode information in limited area which we all know as this rectangle filled with black and white rectangles. The science and math behind QR codes isn't very easy, but there are a ton of articles and videos on YouTube that explain the process.

Scanning QR codes with your smartphone allows to decode the information. If the encoded data was just text, your phone can show the message, but if it's an URL then it will prompt you to open it in the browser. It's a great way to promote your website or project. But can also be used for embedding email addresses, and specific app events.

## Generating QR codes
The file `index.html` contains JavaScript code which can generate encode plain text into a QR code. [Live demo here](https://spurwing.github.io/Appointment-Scheduling-Widgets/QRCode/)

![image](https://user-images.githubusercontent.com/9488406/115966685-0a501b00-a52f-11eb-8c57-db2d6ba9dc26.png)

The default settings allow you to encode 62 characters, which is usally enough for a simple URL or message.
If you need to encode longer texts you can tweek the settings (`version` and `ECL`) using this [reference sheet](https://www.qrcode.com/en/about/version.html).

![business card with qr code](https://user-images.githubusercontent.com/9488406/115966027-1090c800-a52c-11eb-824c-def787546d50.png)
