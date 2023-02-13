//full calendar js settings
import {Calendar} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listGridPlugin from '@fullcalendar/list'

async function filterCalendarAuto(calendar) {
    //get all select team-select
    const teamSelects = document.querySelectorAll(".team-select");
//ad event listener to each select
    for (let select of teamSelects) {
        select.addEventListener("change", async (select) => {
            await scanAll(select);
        })
    }
    //re render the calendar
    calendar.render();
}

async function filterCalendar() {
    console.log("filtering calendar");
    //get all select team-select
    const teamSelects = document.querySelectorAll(".team-select");
    for (let select of teamSelects) {
        await scanAll(select);
    }
}

async function scanAll(select) {
    //make event correspondign to the select visible if ticked else invisible
    const team = select.target.value;
    const events = document.querySelectorAll(`.team-${team}`);
    events.forEach((event) => {
        if (select.target.checked) {
            event.style.display = "block";
        } else {
            event.style.display = "none";
        }
    });
}

async function eventInfoDisplay(info) {
    const eventPopup = document.getElementById("event-popup");
    const eventPopupTitle = document.getElementById("event-popup__title");
    const eventPopupDescription = document.getElementById("event-popup__description");
    const eventPopupTime = document.getElementById("event-popup__time");

    //set the title of event, the team name and the date
    eventPopupTitle.innerHTML = info.event.title;
    eventPopupDescription.innerHTML = info.event.extendedProps.team;
    //set time to hour in 24h format
    const startTime = info.event.start.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const endTime = info.event.end.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    eventPopupTime.innerHTML = startTime + " - " + endTime;

    eventPopup.style.display = "flex";

    //close the popup when clicking anywhere
    window.onclick = function (event) {
        if (event.target === eventPopup) {
            eventPopup.style.display = "none";
        }
    }
}

const calendarOptions = {
    plugins: [
        dayGridPlugin,
        timeGridPlugin,
        listGridPlugin
    ],
    weekends: false,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridWeek',
    //source for events is the calendar route
    events: {
        url: '/calendar',
        method: 'GET',
        failure: function () {
            alert('there was an error while fetching events!');
        },
    },
    expandRows: true,
    timeZone: 'Europe/Paris',
    locale: 'fr',
    eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    },
    slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    },
    slotMinTime: "06:00:00",
    slotMaxTime: "20:00:00",
    //Ad an click on event to get the team name with a popup
    eventClick: (info) => eventInfoDisplay(info),
    eventRender: () => filterCalendar()
}

document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar')
    const calendar = new Calendar(calendarEl, calendarOptions);

    await calendar.render();

    //filter calendar
    await filterCalendarAuto(calendar);

    //refresh the calendar every 5 minutes
    setInterval(() => {
        calendar.refetchEvents();
    }, 300000);
});


