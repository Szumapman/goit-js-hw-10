import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "../css/01-timer.css";
import iziToast from "izitoast";
import 'izitoast/dist/css/iziToast.min.css';

import toastErrorIcon from '../img/toast-error.svg';

const datePickerInput = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("button[data-start]");
const daysSpan = document.querySelector("span[data-days]");
const hoursSpan = document.querySelector("span[data-hours]");
const minutesSpan = document.querySelector("span[data-minutes]");
const secondsSpan = document.querySelector("span[data-seconds]");

startBtn.disabled = true;

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {  
    if (selectedDates[0] > new Date()) {
        userSelectedDate = selectedDates[0];
        startBtn.disabled = false;
        const startButtonCheckerInterval = setInterval(() => {
            if (userSelectedDate < new Date()) {
                startBtn.disabled = true;
                userSelectedDate = null;
                clearInterval(startButtonCheckerInterval);
            }
        }, 1_000);
    } else {
        iziToast.error({
            position: 'topRight',
            iconUrl: toastErrorIcon,
            message: "Please choose a date in the future",
            backgroundColor: "#EF4040",
            messageColor: "white",
            progressBarColor: "#B51B1B",
        });
    }   
  },
};

const fp = flatpickr(datePickerInput, options);
setInterval(() => {
    if (!fp.isOpen && !userSelectedDate) {        
        fp.setDate(new Date(), false);
    }
}, 1_000);

startBtn.addEventListener("click", () => {
    if (userSelectedDate) {
        startBtn.disabled = true;
        datePickerInput.disabled = true;
        return startTimer();
    }
});

function startTimer() {
    const timerInterval = setInterval(() => {
        const remainigTime = userSelectedDate.getTime() - Date.now();
        if (remainigTime <= 0) {
            userSelectedDate = null;
            datePickerInput.disabled = false;
            clearInterval(timerInterval);
            return;
        }
        const { days, hours, minutes, seconds } = convertMs(remainigTime);
        daysSpan.textContent = addLeadingZero(days);
        hoursSpan.textContent = addLeadingZero(hours);
        minutesSpan.textContent = addLeadingZero(minutes);
        secondsSpan.textContent = addLeadingZero(seconds);
    }, 1_000);
}

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}