var sp = new Spurwing();

//=============== provide Spurwing provider ID  here ==============
const SpurwingPID="da960917-20ef-4bb1-8b2d-4b17dee81302"; 
//======================================================================

var times = [];
var apptT = "";
var apptTId="";
function addToList(date) {
  times.push(date);
  $("#generate-button").attr("style", "display:block");
  let tmp = date.replaceAll(':', '-').split(' ');
  let time = tmp[0] + ' ' + tmp[1].slice(0, 2)+':'+tmp[1].slice(3, 5);
  let id = tmp[0] + 'T' + tmp[1].slice(0, 5);
  let opt = `<input type="checkbox" id="${id}" checked><label> ${time}</label><br>`;
  $("div#time-selected").append(opt);
  $("#generate-button").attr("onclick", `getHtml("${times}","${apptT}")`);
}

async function getCustInfo(date, typeId) {
  date = date.substring(0, date.lastIndexOf(" "));
  $("#apptOpt").empty();
}
function getHtml(times, typeId) {
  times = times.split(",");
  let a2 =
    `<p>Dear Customer,<br> please select your appointment time for ` +
    typeId +
    ` :</p><table border="1" style="border-radius: 3px;padding: 25px 30px;display: flex;justify-content: space-between;margin-bottom: 25px;"><tr>`;
  times.sort();
  
//=============== define host name of document here ===========================
  let url="https://creative-aboard-enthusiasm.glitch.me";
//======================================================================
  
  
  let days={};
  for (let time of times) {
    typeId = typeId.replaceAll(" ", "");
    let tmp = time.replaceAll(':', '-').split(' ');
    time = tmp[0] + ' ' + tmp[1].slice(0, 5);
    let id = tmp[0] + 'T' +tmp[1].slice(0, 5); 
    
    if ($("#" + id).prop("checked")) {
      let t=id.split('T');
      let value=days[t[0]];
      let hhmm=t[1].replace('-',':');
      if(value){
        days[t[0]].push(hhmm);
      }
      else{
        days[t[0]] = [hhmm];
      }
    }
  }
  for(let day in days){
      a2+=`<tr><td style="padding: 10px; text-align: center;">${day}</td>`;
      days[day].forEach(t=>{
        let id=day+'T'+t.replace(':','-');
        a2+=`<td style="padding: 10px;text-align: center;"><a href="`+url+`/customerInfo.html?time=${id}&spurwingTypeId=${apptTId}">${t}</a></td>`;
      });
      a2+=`</tr>`;
    }
  a2+=`</table>`;
  
  $("#demo").html(a2);
  $(".workbench").html("<button id='copy-button' onclick='copyHtml()'>Copy html</select>");
}

function copyHtml(){
  let p =$("#demo")[0];
  document.getSelection().setBaseAndExtent(p, 0, p, p.childNodes.length); 
  document.execCommand("copy");
}



async function showTime(t, date) {
  let apptTypeId = t;
  apptTId=t;
  let avilableSlot = await sp.get_slots_available(SpurwingPID, apptTypeId, date, date);
  let timeList = ``;
  avilableSlot = avilableSlot.slots_available;
  avilableSlot.forEach(function(s, i, avilableSlot) {
    let date = `${s.date}`;
    let time = date.split(" ");
    time = time[1].slice(0, 5);
    timeList += `<span id=${time}><button class="timeButton" onclick="addToList('${date}')">${time}</select></span>`;
  });
  $("div#available-time").html(timeList);
}
async function loadDatePicker(apptTypeId, apptTypeName) {
  apptT = apptTypeName;
  $("div#apptOpt").empty();
  $("div#opt-display").empty();
  $("div#apptOpt").append(`<p id="instruction">Appointment Type: ${apptTypeName}</p>`);
  var datepicker = new tui.DatePicker("#wrapper", {
    date: new Date(),
    input: {
      element: "#datepicker-input",
      format: "yyyy-MM-dd HH:mm A"
    },
    timePicker: false, // time picker
    showAlways: true // optional
  });
  datepicker.on("change", async function() {
    showTime(apptTypeId, datepicker.getDate());
  });
}
async function load() {
  // API: https://github.com/nhn/tui.date-picker/blob/master/docs/getting-started.md
  let timesDisplay = ` <div class="workbench"><div><div id="time-selected"><p id="instruction">Selected Time to Send: </p></div>
  <button id="generate-button" onclick="getHtml()" style="display:none">Generate html</select></div>
  <div id="apptOpt"><p id="instruction">Please select appointment Type:</p></div><div id="available-time"></div></div>`;
  $("div#user-select-session").append(timesDisplay);
  let apptTypes = await sp.get_appointment_types(SpurwingPID);
  let apptOpts = ``;
  apptTypes.forEach(t => {
    apptOpts += `<span><button class="apptTypeButton" onclick="loadDatePicker('${t.id}','${t.name}')">${t.name}</select></span>`;
  });
  $("div#apptOpt").append(apptOpts);
}
