var sp = new Spurwing();
async function submitAppt(date,typeId){
    let D = await sp.complete_booking(SpurwingPID, typeId, $("#email").val(), $("#firstname").val(), $("#lastname").val(), date,'Test booking');
    $( "#apptOpt" ).empty();
    $( "#apptOpt" ).append("<h4> See you at "+date+".</h4>");
}

async function getCustInfo(date,typeId){
    console.log("getCustInfo is called")
    date=date.substring(0,date.lastIndexOf(" "));
    $( "#apptOpt" ).empty();
    $("#typeHeader").empty();
   
    let cusInfo=`First Name <input type="text" id="firstname"><br>Last Name <input type="text" id="lastname"><br>Email <input type="text" id="email"><br>
        <button onclick="submitAppt('${date}','${typeId}')">Confirm</select>`;
    $( "#apptOpt" ).append(cusInfo);
    /*let D = await sp.complete_booking(SpurwingPID, typeId, customer.email, customer.first_name, customer.last_name, date, 'Test booking');
    //let D = await sp.complete_booking(SpurwingPID, typeId, 'ilya2@nevolin.be', 'Ilya', 'Nevo', date,'Test booking');
    */
}
async function showTime(apptTypeId,date){
    let avilableSlot= await sp.get_slots_available(SpurwingPID, apptTypeId,date,date);
                  console.log(avilableSlot);
      let timeList=``;
      avilableSlot=avilableSlot.slots_available;
      avilableSlot.forEach(function(s, i, avilableSlot) {
          let date=`${s.date}`;
          let time=date.split(" "); time=time[1].slice(0,5);
          timeList+=`<span id=${time}><button  onclick="getCustInfo('${date}','${apptTypeId}')">${time}</select></span>`;
      });
      $( "div#apptOpt" ).html(timeList);
}
async function showOpt(date){
    let time=date.toString().split(" "); 
    let apptTypes= await sp.get_appointment_types(SpurwingPID);
    console.log(apptTypes);
    $( "#apptOpt" ).empty();
    let apptOpts=``;
    apptTypes.forEach(function(t, i, apptTypes) {
        apptOpts+=`<div id=${t.name}><button  onclick="showTime('${t.id}','${date}')">${t.name}</select></div>`;
    });
    $( "#apptOpt" ).append(apptOpts);
    }                           //replace it  with a for loop , maybe dropdown / grid display
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
  datepicker.on('change', async function() {
    $('.tui-datepicker').append(`<p id="typeHeader">Please select appointmet type: </p><div id="apptOpt"><div>`);
    showOpt(datepicker.getDate());
  });
}

