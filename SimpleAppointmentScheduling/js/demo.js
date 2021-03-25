
let sp = new Spurwing();

const PID = '3311c352-3c5e-4009-b5c3-1d550cc84398';
const appointmentTypeID = "59fabb02-d946-4849-b8b3-96a313f982a4"; // let allAppTypes = await sp.get_appointment_types(PID);
const show_months = 3; // how many months to show (everything else disabled)

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(timezone)
$(document).ready(() => {
  init_calendar();
})

function getRange(startDate, endDate, type) {
  let fromDate = moment(startDate)
  let toDate = moment(endDate)
  let diff = toDate.diff(fromDate, type)
  let range = []
  for (let i = 0; i < diff; i++) {
    range.push(moment(startDate).add(i, type).format('YYYY-MM-DD'))
  }
  return range
}

async function init_calendar() {
    const days_available = [];
    let minDate = moment();
    let maxDate = moment().add(show_months-1, 'M');
    disabledDates = []
    while (minDate < maxDate) {
        let B = await sp.get_days_available(PID, appointmentTypeID, minDate);
        console.log({B});    
        days_available.push(...B.days_available)
        minDate = minDate.startOf('month').add(1, 'M')
    }

    let range = getRange(days_available[0], days_available.slice(-1)[0], 'days')
    for (const el of range) {
        if (!days_available.includes(el))
            disabledDates.push(el);
    }

    let cal = $('.disabled-range-calendar').pignoseCalendar({
        select: onSelectHandler,
        minDate: days_available[0],
        maxDate: days_available.slice(-1)[0],
        disabledDates: disabledDates
    });
    onSelectHandler([cal.settings.date]);
}

function fixDateOffset(s) {
    return s.replace(' -', '-').replace(' +', '+');
}

async function onSelectHandler(date) {
    $('.calendar-box').empty().show();
    let selectedDate = null;
    if (date[0] !== null) {
        selectedDate = date[0].format('YYYY-MM-DD');
    } else {
        $('.calendar-box').hide();
        return; // sometimes clicking on whitespace unselects, useless feature.
    }
    
    let C = await sp.get_slots_available(PID, appointmentTypeID, selectedDate, selectedDate)
    console.log({C})

    let slots = []
    for (const el of C.slots_available) {
        const slot = moment(fixDateOffset(el.date)).format('HH:mm')
        slots.push(`<option value="${el.date}">${slot}</a>`);
    }
    
    $('.calendar-box').append(`<select class="calendar-slots">${slots.join('')}</select>`);
    $('.calendar-box').append(`<input name="name" id="calendar-name" placeholder="full name">`);
    $('.calendar-box').append(`<input name="email" id="calendar-email" placeholder="email">`);
    $('.calendar-box').append(`<input id="calendar-book_slot" type="button" value="submit">`);
    $('.calendar-box').append(`<br><span style="color:red;" id="calendar-message"></span>`);  
}

$(document).on('click', '#calendar-book_slot', async function(e) {
    e.preventDefault();
    const selectedSlot = $('.calendar-slots').val();
    const name = $('#calendar-name').val();
    const email = $('#calendar-email').val();
    $('#calendar-name').css({'background-color': 'white'})
    $('#calendar-email').css({'background-color': 'white'})
    $('.calendar-slots').css({'background-color': 'white'})
    if (name && name.length > 1 && email && email.length > 1 && selectedSlot && selectedSlot.length > 1) {
        try {
            let D = await sp.complete_booking(PID, appointmentTypeID, email, name, '-', selectedSlot, 'Online Booking');
            console.log({D})
            if (D && 'appointment' in D && D.appointment.id) {
                $('.calendar-box').html('Appointment booked!<br>' + moment(fixDateOffset(selectedSlot)).format('HH:mm') + ' to ' + moment(fixDateOffset(D.appointment.end)).format('HH:mm') )
            }    
        } catch(err) {
            $('#calendar-message').text(JSON.parse(err.responseText).message)
        }
    } else {
        if (!name || name.length <= 1) {
            $('#calendar-name').css({'background-color': '#ff8e8e'})
        }
        if (!email || email.length <= 1) {
            $('#calendar-email').css({'background-color': '#ff8e8e'})
        }
        if (!selectedSlot || selectedSlot.length <= 1) {
            $('.calendar-slots').css({'background-color': '#ff8e8e'})
        }
    }
})
