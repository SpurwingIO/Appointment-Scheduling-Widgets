let sp = new Spurwing();
const PID = 'your_provider_id';
// let allAppTypes = await sp.get_appointment_types(PID, true);
const appointmentTypeID = "your_appointment_type_id";
let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

$(document).ready(() => {
  init_calendar();
})

async function init_calendar() {
    const days_available = [];
    const show_months = 2; // how many months to show (everything else disabled)
    let minDate = moment();
    let maxDate = moment().add(show_months-1, 'M');
    while (minDate < maxDate) {
        let B = await sp.get_days_available(PID, appointmentTypeID, minDate.format('YYYY-MM-DD'), timezone, false);
        console.log({B});    
        days_available.push(...B.days_available)
        minDate = minDate.startOf('month').add(1, 'M')
    }
    
    let cal = $('.disabled-range-calendar').pignoseCalendar({
        select: onSelectHandler,
        minDate: days_available[0],
        maxDate: days_available.slice(-1)[0]
    });
    onSelectHandler([cal.settings.date]);
}

function fixDateOffset(s) {
    return s.replace(' -', '-').replace(' +', '+');
}

async function onSelectHandler(date) {
    $('.box').empty().show();
    let selectedDate = null;
    if (date[0] !== null) {
        selectedDate = date[0].format('YYYY-MM-DD');
    } else {
        $('.box').hide();
        return; // sometimes clicking on whitespace unselects, useless feature.
    }
    
    let C = await sp.get_slots_available(PID, appointmentTypeID, selectedDate, selectedDate, false)
    console.log({C})

    let slots = []
    for (const el of C.slots_available) {
        const slot = moment(fixDateOffset(el.date)).format('HH:mm')
        slots.push(`<option value="${el.date}">${slot}</a>`);
    }
    
    $('.box').append(`<select class="slots">${slots.join('')}</select>`);
    $('.box').append(`<input id="name" placeholder="full name">`);
    $('.box').append(`<input id="email" placeholder="email">`);
    $('.box').append(`<input id="book_slot" type="button" value="submit">`);
    $('.box').append(`<br><span style="color:red;" id="message"></span>`);  
}

$(document).on('click', '#book_slot', async function(e) {
    e.preventDefault();
    const selectedSlot = $('.slots').val();
    const name = $('#name').val();
    const email = $('#email').val();
    if (name && name.length > 1 && email && email.length > 1 && selectedSlot && selectedSlot.length > 1) {
        try {
            let D = await sp.complete_booking(PID, appointmentTypeID, selectedSlot, timezone, name, '-', email, '', 'Online Booking');
            console.log({D})
            if (D && 'appointment' in D && D.appointment.id) {
                $('.box').html('Appointment booked!<br>' + moment(fixDateOffset(selectedSlot)).format('HH:mm') + ' to ' + moment(fixDateOffset(D.appointment.end)).format('HH:mm') )
            }    
        } catch(err) {
            $('#message').text(JSON.parse(err.responseText).message)
        }
    }
})
