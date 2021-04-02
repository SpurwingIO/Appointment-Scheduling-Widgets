
// Github:  https://github.com/xdan/datetimepicker
// Docs:    https://xdsoft.net/jqplugins/datetimepicker/

$(document).ready(() => {
  load();
});

function load() {

  $('#picker').datetimepicker({
   allowTimes: ['12:00', '13:00', '15:00', '19:00', '20:00'],
   inline:true,
   onChangeDateTime: onChangeDateTime, 
   defaultSelect: false,
  });

}

function onChangeDateTime(dp, input) {
  console.log(input.val())
}

// when date + time selected/
//    make it show a name+email input fields + submit button below the calendar