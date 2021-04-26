// Github:  https://github.com/xdan/datetimepicker
// Docs:    https://xdsoft.net/jqplugins/datetimepicker/

let sp = new Spurwing();

sp.get_appointment_types(SpurwingPID).then(result => console.log(result));

$(document).ready(() => {
  load();
});

function load() {
  $("#picker").val(""); // clear
  $("#picker").datetimepicker({
    timepicker: false,
    inline: true,
    onChangeDateTime: onChangeDateTime,
    defaultSelect: false,
    onAfterChange: updateCalSelected
  });
}

const selected = {};

async function onChangeDateTime(dp, input) {
  const date = input.val().split(" ")[0];
  $(".timepicker")
    .height($(".xdsoft_datetimepicker").height())
    .css("display", "inline-block")
    .html("");

  // here we load timeslots
  const { slots_available } = await sp.get_slots_available(
    SpurwingPID,
    SpurwingAPTID,
    date,
    date
  );
  for (const slot of slots_available) {
    let i = slot.date
      .split(" ")[1]
      .split(":")
      .slice(0, 2)
      .join(":");
    let classes =
      selected[date] && selected[date].includes(i) ? "class=selected" : "";
    $(".timepicker").append(
      "<button " + classes + " data-slot=" + i + ">" + i + "</button>"
    );
  }

  $(dp).css({ background: "red" });
  updateCalSelected();
}

$(document).on("click", ".timepicker button", toggleSlot);
async function toggleSlot(e) {
  e = e.target;
  $(e).toggleClass("selected");
  const dt = $("#picker")
    .val()
    .split(" ");
  const date = dt[0],
    time = dt[1];
  selected[date] = selected[date] || [];

  const slot = $(e).data("slot");
  if (!selected[date].includes(slot)) selected[date].push(slot);
  else selected[date] = selected[date].filter(x => x != slot);

  if (!selected[date].length) delete selected[date];
  // $('#notes').text(Object.keys(selected).join(', '))
  console.log({ selected });
}

function updateCalSelected() {
  const keys = Object.keys(selected);
  for (let key of keys) {
    key = key.split("/");
    const Y = parseInt(key[0]),
      M = parseInt(key[1]) - 1,
      D = parseInt(key[2]);
    $(
      `.xdsoft_calendar tr td[data-date=${D}][data-month=${M}][data-year=${Y}]`
    ).addClass("xdsoft_current");
  }
}

$(document).ready(function copyBtn() {
  $("body").append(
    $("<button>")
      .prop({
        type: "button",
        innerHTML: "Copy to clipboard",
        id: "generate"
      })
      .on('click', function(ev) {
        console.log(selected);
        //Create a HTML Table element.
        let table = $("<table />");
        table[0].border = "1";
        //Get the count of columns.
        const cols = Object.keys(selected);
        let columnCount = cols.length;
        //Add the header row.
        let row = $(table[0].insertRow(-1));
        for (let i = 0; i < columnCount; i++) {
          let headerCell = $("<th />");
          headerCell.html(cols[i]);
          row.append(headerCell);
        }
        //Add the data rows.
        // find max rows

        let arrays = Object.values(selected);
        let max = 0;

        max = Math.max(...arrays.map(x => x.length));
        console.log(max);

        for (let j = 0; j < max; j++) {
          row = $(table[0].insertRow(-1));
          for (let i = 0; i < columnCount; i++) {
            let time = selected[cols[i]][j];
            let cell = $("<td  />");
            if (time) {
              let url =
                "meeting.html?date=" + cols[i] + "&time=" + encodeURI(time);
              let href = $('<a href="' + url + '">' + time + "</a>");
              cell.html(href);
            }
            row.append(cell);
          }
        }

        $("#divTable").html(table).show();          // set html data
        selectText($('#divTable')[0])  // select/highlight the div
        document.execCommand('copy')   // execute copy API
        $("#divTable").html('').hide();
      })
  );
});

function selectText(element) {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

/*
  todo:

    [X] line 29-32 --> load time slots from spurwing (right now it's just number)
    [X] generate button
    [ ]   on click generate --> generate HTML calendar code

    [ ] separate page for accepting schedule / booking
        : book.html?date=....&spurwing_provider_id
        -> extract date
        -> extract PID
        [ ] name + email field + submit button
            --> click submit -> execute booking (date + PID + name + email)



  https://github.com/Spurwing/Spurwing-API-Javascript-Library

*/
