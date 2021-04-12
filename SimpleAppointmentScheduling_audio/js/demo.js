;((SpurwingPID, SpurwingAPTID, SpurwingHookURL) => {
let cal;
let sp = new Spurwing();
const show_months = 3; // how many months to show (everything else disabled)

const spa = new SpurwingAudio();
let name='', email='';

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(timezone)
$(document).ready(async () => {
    await init_calendar();

    let socket = io('https://nevolin.be', {
        path: "/Spurwing/audio/socket.io"
    });

    socket.on('text', data => {
        console.log(data)
        // set date
        if (data.nlp) {
            const date = moment(data.nlp.replace('.000Z', ''));
            cal.pignoseCalendar('set', date.format('YYYY-MM-DDTHH:mm'));
            onSelectHandler([date])
        }
        let raw = data.raw.toLowerCase();
        // set name
        if (raw.includes('name')) {
            let arr = raw.split('name is ')
            if (arr.length === 1)
                arr = raw.split('name ')
            if (arr.length === 2) {
                $('#calendar-name').val(arr[1].trim());
            }
        }
        // set email
        if (raw.includes('email')) {
            let arr = raw.split('email is ')
            if (arr.length === 1)
                arr = raw.split('email ')
            if (arr.length === 2) {
                let em = arr[1].trim();
                em=em.replace(' at ', '@')
                em=em.replace(' dot ', '.')
                $('#calendar-email').val(em);
            }
        }
    })


    spa.init().then((stream) => {
        spa.startVAD(()=>console.log('recording'), (buffer, duration) => {
            duration = (Math.round(duration*100)/100);
            if (duration <= 1.5 || duration >= 20.0) {
                console.log('skip processing, audio too '+(duration >= 20 ? 'long':'short')+' ('+duration+' sec)');
            } else {
                socket.emit('stream', {buffer, id:0})
                console.log('processing ('+duration+' sec)...')
            }
        })
    }).catch((err) => {
        alert("You must allow your microphone.");
        console.log(error);
    });
    
});

let BTN_LOCK = true;
function btnLock() {
    BTN_LOCK = true;
    $('#calendar-book_slot').prop('disabled', true);
}
function btnUnLock() {
    BTN_LOCK = false;
    $('#calendar-book_slot').prop('disabled', false);
}

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
        let B = await sp.get_days_available(SpurwingPID, SpurwingAPTID, minDate);
        console.log({B});    
        days_available.push(...B.days_available)
        minDate = minDate.startOf('month').add(1, 'M')
    }

    let range = getRange(days_available[0], days_available.slice(-1)[0], 'days')
    for (const el of range) {
        if (!days_available.includes(el))
            disabledDates.push(el);
    }

    cal = $('.disabled-range-calendar').pignoseCalendar({
        select: onSelectHandler,
        minDate: days_available[0],
        maxDate: days_available.slice(-1)[0],
        disabledDates: disabledDates
    });
    await onSelectHandler([cal.settings.date]);
}

function fixDateOffset(s) {
    return s.replace(' -', '-').replace(' +', '+');
}

async function onSelectHandler(date) {
    name = $('#calendar-name').val()||'';
    email = $('#calendar-email').val()||'';
    const selectedSlot = $('.calendar-slots').val();
    $('.calendar-box').empty().show();
    let selectedDate = null;
    if (date[0] !== null) {
        selectedDate = date[0].format('YYYY-MM-DD');
    } else {
        $('.calendar-box').hide();
        return; // sometimes clicking on whitespace unselects, useless feature.
    }
    
    let C = await sp.get_slots_available(SpurwingPID, SpurwingAPTID, selectedDate, selectedDate)
    console.log({C})

    let slots = []
    for (const el of C.slots_available) {
        const slot = moment(fixDateOffset(el.date)).format('hh:mm A')
        slots.push(`<option value="${el.date}">${slot}</a>`);
    }
    // 2021-04-14 03:45:00 +0200
    
    $('.calendar-box').append(`<select class="calendar-slots">${slots.join('')}</select>`);
    $('.calendar-box').append(`<input name="name" id="calendar-name" placeholder="name" value="${name}">`);
    $('.calendar-box').append(`<input name="email" id="calendar-email" placeholder="email" value="${email}">`);
    $('.calendar-box').append(`<input id="calendar-book_slot" type="button" value="submit">`);
    $('.calendar-box').append(`<br><span style="color:red;" id="calendar-message"></span>`);

    // if time set by voice command:
    if ($('.calendar-slots option[value="'+selectedDate+date[0].format(" HH:mm:00 ZZ")+'"]').val()) {
        $('.calendar-slots').val(selectedDate+date[0].format(" HH:mm:00 ZZ"));
    }
    // on-change date preserve timeslot:
    else if (selectedSlot) {
        $('.calendar-slots').val(selectedDate+' '+selectedSlot.split(' ').slice(1).join(' '));
    }

    btnUnLock();
}

$(document).on('click', '#calendar-book_slot', async function(e) {
    e.preventDefault();
    if (BTN_LOCK) {console.log('prevent dbclck'); return;}
    btnLock();
    const selectedSlot = $('.calendar-slots').val();
    name = $('#calendar-name').val();
    email = $('#calendar-email').val();
    $('#calendar-name').css({'background-color': 'white'})
    $('#calendar-email').css({'background-color': 'white'})
    $('.calendar-slots').css({'background-color': 'white'})
    if (name && name.length > 1 && email && email.length > 1 && selectedSlot && selectedSlot.length > 1) {
        try {
            let D = await sp.complete_booking(SpurwingPID, SpurwingAPTID, email, name, '-', selectedSlot, 'Online Booking');
            console.log({D})
            if (D && 'appointment' in D && D.appointment.id) {
                if (SpurwingHookURL) {
                    $.getJSON(SpurwingHookURL, {
                        name,
                        email,
                        start: fixDateOffset(selectedSlot),
                        end: fixDateOffset(D.appointment.end),
                    }, function(resp) {
                        console.log(SpurwingHookURL, resp)
                    })
                }
                $('.calendar-box').html('Appointment booked!<br>' + moment(fixDateOffset(selectedSlot)).format('hh:mm A') + ' to ' + moment(fixDateOffset(D.appointment.end)).format('hh:mm A') )
            }    
        } catch(err) {
            $('#calendar-message').text(JSON.parse(err.responseText).message)
        } finally {
            btnUnLock();
        }
    } else {
        btnUnLock();
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
})(SpurwingPID, SpurwingAPTID, SpurwingHookURL);