var sp = new Spurwing();

//=============== provide Spurwing provider ID  here ==============
const SpurwingPID="providerid"; 
//======================================================================

async function submitAppt(date,typeId){
    try{
      let D = await sp.complete_booking(SpurwingPID, typeId, $("#email").val(), $("#firstname").val(), $("#lastname").val(), date,'Test booking');
      $( "#apptTaker" ).html("<h4 id='instruction'> See you at "+date+".</h4>");
    }catch(err){
      $('#clientInfo').html("<h4 id='instruction'>Sorry, current appointment time has been token, please select another timeslot.</h4>");
    }
}

async function getCustInfo(date,typeId){
    date=date.substring(0,date.lastIndexOf(" "));
    $("#typeHeader").empty();
   
    let cusInfo=`<div id="instruction">First Name <input type="text" id="firstname"><br>Last Name <input type="text" id="lastname"><br>Email <input type="text" id="email"><br>
        <button class="confirmButton" onclick="submitAppt('${date}','${typeId}')">Confirm</select></div>`;
    $( "#apptTaker" ).html(cusInfo);
}
async function showTime(apptTypeId,date){
    let avilableSlot= await sp.get_slots_available(SpurwingPID, apptTypeId,date,date);
    let timeList=`<p id="instruction">Please select appointmet time: </p>`;
    avilableSlot=avilableSlot.slots_available;
    avilableSlot.forEach(function(s, i, avilableSlot) {
        let date=`${s.date}`;
        let time=date.split(" "); time=time[1].slice(0,5);
        timeList+=`<span id=${time}><button class="timeButton" onclick="getCustInfo('${date}','${apptTypeId}')">${time}</select></span>`;
    });
    $( "#apptTaker" ).html(timeList);
}
async function showOpt(date){
    let time=date.toString().split(" "); 
    let apptTypes= await sp.get_appointment_types(SpurwingPID);
    let apptOpts=``;
    apptTypes.forEach(function(t, i, apptTypes) {
        apptOpts+=`<span id=${t.name}><button class="apptTypeButton" onclick="showTime('${t.id}','${date}')">${t.name}</select></span>`;
    });
    $("#apptOpt").html(apptOpts);
    } 
    
async function load() {
  // API: https://github.com/nhn/tui.date-picker/blob/master/docs/getting-started.md
  var datepicker = new tui.DatePicker('#wrapper', {
      date: new Date(),
      input: {
      element: '#datepicker-input',
      format: 'yyyy-MM-dd HH:mm A'
      },
      timePicker: false, // time picker
      showAlways: true, // optional
  });
  $('.tui-datepicker').append(`<div id="apptTaker"></div>`);
  datepicker.on('change', async function() {
    $('#apptTaker').html(`<p id="instruction">Please select appointmet type: </p><div id="apptOpt"><div>`);
    showOpt(datepicker.getDate());
  });
}

