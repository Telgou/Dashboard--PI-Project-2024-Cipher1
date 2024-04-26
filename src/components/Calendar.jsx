import { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { format } from "date-fns"; // Importing date-fns for date formatting
import FullCalendar from '@fullcalendar/react'; // Assurez-vous d'avoir correctement installé la bibliothèque FullCalendar
import EventList from "./EventList.jsx";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

import Header from "../Header";
//import { tokens } from "../theme.js"

const Calendar = () => {
  const theme = useTheme();
  //const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  const formatDateForEvent = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setCurrentEvents(storedEvents);
  }, []);

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");

    if (title) {
      const newEvent = {
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.start,
        end: selected.end,
        allDay: selected.allDay,
      };

      // Update state
      setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);

      // Update local storage
      localStorage.setItem("calendarEvents", JSON.stringify([...currentEvents, newEvent]));
    }
  };

  const removeEvent = (eventId) => {
    const updatedEvents = currentEvents.filter((event) => event.id !== eventId);

    // Update state
    setCurrentEvents(updatedEvents);

    // Update local storage
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
  };

  const handleEventClick = (selected) => {
    if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
      const updatedEvents = currentEvents.filter((event) => event.id !== selected.event.id);
      removeEvent(selected.event.id);

      // Remove the event from the FullCalendar display
      selected.event.remove();
    }
  };



  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          //backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  //backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDateForEvent(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box className="calendar-container" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents}
          />
        </Box>
      </Box>
    </Box>
  );

};

export default Calendar;
