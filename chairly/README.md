# Snip

A mobile-first appointment booking prototype for independent barbers and hairdressers.

## Current features

- Public establishment page with services and two professionals
- Booking flow for service, professional, date, time and customer details
- Availability generated from each professional's working days, hours and slot interval
- Prevention of double-booking an occupied time
- Customer view for amending and cancelling bookings
- Admin diary with appointment completion
- Admin controls for staff working days, hours and slot length
- Responsive mobile and desktop layouts
- Local browser persistence for bookings and settings

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to type-check and create a production build.

## Prototype limitations

This version uses local browser storage. There is no account authentication, shared database, email delivery or live payment. Bookings only persist in the browser where they were created. These are the main requirements for a production version.
