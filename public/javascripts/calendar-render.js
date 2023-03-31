//full calendar js settings
// import {Calendar} from '@fullcalendar/core'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import listGridPlugin from '@fullcalendar/list'


async function filterCalendarAuto(calendar) {
    //get all select team-select
    const teamSelects = document.querySelectorAll(".team-select");
//ad event listener to each select
    for (let select of teamSelects) {
        select.addEventListener("change", async (select) => {
            //get html collection of select
            //if select is input
            if (select.currentTarget.tagName === "INPUT") { await scanAll(select.target); }
        })
    }
    //re render calendar
    calendar.render();
}

async function filterCalendar() {
    //get all select team-select
    const teamSelects = document.querySelectorAll("input.team-select");
    for (let select of teamSelects) {
        await scanAll(select);
    }
}

async function scanAll(select) {
    //make event corresponding to the select visible if ticked else invisible;
    const team = select.value;

    const events = document.querySelectorAll(`.team-${team}`);
    events.forEach((event) => {
        if (select.checked) {
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
    let startTime = new Date(info.event.start);
    let endTime = new Date(info.event.end);

    //remove 2 hour from the start and end date for correction of the time zone (very dirty)
    startTime.setHours(startTime.getHours() - 1);
    endTime.setHours(endTime.getHours() - 1);

    startTime = startTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    endTime = endTime.toLocaleTimeString('fr-FR', {
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
    weekends: false,
    headerToolbar: {
        left: 'prev,next today listWeek',
        center: 'title',
        right: 'timeGridDay,timeGridWeek,dayGridMonth'
    },
    initialView: 'timeGridDay',
    //source for events is the calendar route
    events: {
        url: '/calendar',
        method: 'GET',
        failure: function () {
            alert('Il y a eu un problème avec le chargement des événements, rechargez la page !');
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
    slotEventOverlap: false,
    //Ad an click on event to get the team name with a popup
    eventClick: (info) => eventInfoDisplay(info),
    // eventRender: () => filterCalendar()
}

document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar')
    const calendar = new FullCalendar.Calendar(calendarEl, calendarOptions);

    await calendar.render();

    //filter calendar
    await filterCalendarAuto(calendar);

    //refresh the calendar every 5 minutes
    setInterval(() => {
        calendar.refetchEvents();
    }, 300000);

    //listen for any changes in the calendar div and all its childs and under childs
    const observer = new MutationObserver(() => {
        filterCalendar();
    });
    observer.observe(calendarEl, {
        childList: true,
        subtree: true
    });
});
