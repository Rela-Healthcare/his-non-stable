import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

var myEventsList = [
  {
    start: moment().toDate(),
    end: moment().add(0, "days").toDate(),
    title: "UHID 7786, Dr. Subramani",
  },
];
// console.log(moment());
const MyCalendar = (props) => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
);

export default MyCalendar;
