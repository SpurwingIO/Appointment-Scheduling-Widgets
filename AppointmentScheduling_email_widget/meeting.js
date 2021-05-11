 let sp = new Spurwing();
    const urlParams = new URLSearchParams(window.location.search);    
    console.log(urlParams.get('date'), urlParams.get('time'))
    const date = urlParams.get('date')
    const time = urlParams.get('time')
    
  $(document).ready(function(){
    $('h3.hello').append("<div id='mine'>"+date+"</div>");
    $('h3.hello').append("<div id='mine'>"+time+"</div>");
    $('.form').append(`<input name="name" id="calendar-name" placeholder="full name">`);
    $('.form').append(`<input name="email" id="calendar-email" placeholder="email">`);
    $('.form').append(`<input id="calendar-book_slot" type="submit" value="submit">`);
    $(document).on('click', '#calendar-book_slot', async function(e) {
      const name = $('#calendar-name').val();
      const email = $('#calendar-email').val()
      const selectedSlot = date  + ' ' + time

      // try {
        let D = await sp.complete_booking(SpurwingPID, SpurwingAPTID, email, name, '-', selectedSlot, 'Secure Videochat');
      console.log(D);
      //}
        
          $(".form").hide();
          $('#postresult').html('Appointment booked!');
          $("#calendar-book_slot").prop('disabled', true);
    });  
    
	});