const monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
const options = {
    position: 'top-right'
}
let notifier = new AWN(options);
let chosenDay;
const oldValues = {};

const init = () => {
    try {
        const month = monthNames[currentMonth];
        document.getElementById('current').textContent = `${month} ${currentYear}`;
        displayCalendar(currentMonth, currentYear)
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const displayCalendar = (currentMonth, currentYear) => {
    try {
        const month = monthNames[currentMonth];
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        let appointment = document.getElementById('appointmentContainer');
        appointment.style.visibility = 'hidden';
    
        let days = setupDaysInMonth(firstDay, daysInMonth, lastDay)
        document.getElementById('current').textContent = `${month} ${currentYear}`;
        let tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = "";
        let row = document.createElement('tr');
        let cell = null;
        let total = days.length;
        for (let i = 0; i < total; i++) {
            cell = document.createElement('td');
            if (days[i] == 'empty') {
                cell.classList.add("empty");
            } else {
                const span = document.createElement('span')
                span.innerHTML = days[i];
                span.classList.add('days');
                cell.setAttribute('id', `${days[i]}`);
                span.addEventListener('click', handleAppointments);
                cell.appendChild(span);
            }
            row.appendChild(cell);
            if (i != 0 && (i + 1) % 7 == 0) {
                tableBody.appendChild(row);
                row = document.createElement('tr');
            }
        }
    
        tableBody.appendChild(row);
        displayAppointments();
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const setupDaysInMonth = (firstDay, daysInMonth, lastDay) => {
    try {
        const days = [];
        // Calculate number of empty cells before first day of month
        if (firstDay.getDay() != 0) {
            for (let i = 0; i < firstDay.getDay(); i++) {
                days.push("empty");
            }
        }
    
        Number.prototype.pad = function(size) {
            var s = String(this);
            while (s.length < (size || 2)) {s = "0" + s;}
            return s;
        }
    
        // Number of days in month
        for (let i = 1; i <= daysInMonth; i++) {
            
            if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9) {
                days.push(i.pad(2));
            } else {
                days.push(i);
            }
        }
    
        // Calculate number of empty cells after last day of month
        if (lastDay.getDay() != 6) {
            let endLength;
            if (lastDay.getDay() === 0) {
                endLength = 6;
            } else {
                endLength = 6 - lastDay;
            }
            for (let i = 0; i < endLength; i++) {
                days.push("empty");
            }
        }
    
        return days;
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

/* Function to handle toggling of sidebar */
const toggle = () => {
    try {
        document.getElementById('sidebar').classList.toggle('active');
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

/* Function to handle showing previous month */
const handlePrev = () => {
    try {
        currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        displayCalendar(currentMonth, currentYear);
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

/* Function to handle showing previous month */
const handleNext = () => {
    try {
        currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1 ) % 12;
        displayCalendar(currentMonth, currentYear);
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

/* Function to handle creating appointments */
const handleAppointments = (e) => {
    try {
        e.stopPropagation();
        const month = monthNames[currentMonth];
        chosenDay = Number(e.target.innerHTML);
        const chosenDate = new Date(currentYear, currentMonth, Number(e.target.innerHTML));
        let appointment = document.getElementById('appointmentContainer');
        let dateImage = document.getElementById('dateImage');
        const date = `${month} ${e.target.innerHTML}`;
    
        if (chosenDate < currentDate && chosenDate.getDate() !== currentDate.getDate()) {
            appointment.style.visibility = 'hidden'; 
            return notifier.alert('Cannot book appointment for dates that have passed!')
        }
        
        dateImage.innerHTML = ''; 
        let image = document.createElement('img');
        image.setAttribute('src', `https://via.placeholder.com/100x50/FFF/000?text=${date}`);
        image.setAttribute('alt', 'current date');
        image.classList.add('currentDate');
        dateImage.appendChild(image);
    
        if (appointment.style.visibility === 'hidden') {
            appointment.style.visibility = '';
        } 
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const saveAppointment = () => {
    try {
        const month = monthNames[currentMonth];
        let title = document.getElementById('appointmentTitle').value;
        let location = document.getElementById('appointmentLocation').value;
        let description = document.getElementById('appointmentDescription').value;
        let startingTime = document.getElementById('startingTime').value;
        let endingTime = document.getElementById('endingTime').value;
        const timeRange = `${startingTime} - ${endingTime}`;
        const data = {};
    
        if (!title || !startingTime || !endingTime) {
            return notifier.alert('Please enter values in their appropriate format for the required fields')
        }

        if (startingTime > endingTime) {
            return notifier.alert('Start time cannot be greater than end time');
        }

        if (startingTime == endingTime) {
            return notifier.alert('Start time cannot be the same as end time');
        }
    
        if (!localStorage.getItem(`${month} ${currentYear}`)) {
            data[chosenDay] = {[timeRange] : {
                title,
                location,
                description
            }}
            localStorage.setItem(`${month} ${currentYear}`, JSON.stringify(data));  
        } else {
            const appointments = JSON.parse(localStorage.getItem(`${month} ${currentYear}`));
            if (!Object.prototype.hasOwnProperty.call(appointments, [chosenDay])) {
                appointments[chosenDay] = {[timeRange] : {
                    title,
                    location,
                    description
                }}
                localStorage.setItem(`${month} ${currentYear}`, JSON.stringify(appointments)); 
            } else {
                const appointmentsRange = Object.keys(appointments[chosenDay]);        
                const isOverlapping = checkIfOverlapping(appointmentsRange, startingTime, endingTime);
        
                if (appointmentsRange.includes(timeRange) || isOverlapping) {
                    notifier.alert('Cannot book appointment for time already allocated');
                } else {
                    appointments[chosenDay][timeRange] = {
                        title,
                        location,
                        description
                    }
                    localStorage.setItem(`${month} ${currentYear}`, JSON.stringify(appointments)); 
                }
            }
        }
        window.location.reload();

    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const getTime = (time) => {
    try {
        let d = new Date('1/1/2019 ' + time);
        return d;
    } catch {
        notifier.alert('Something went wrong!');
    }
}

const checkIfOverlapping = (appointmentsRange, startingTime, endingTime) => {
    try {
        for (let appointments of appointmentsRange) {
            const timeRanges = appointments.split(' - ');
            const startTime2 = timeRanges[0];
            const endTime2 = timeRanges[1];
    
            return getTime(startingTime) <= getTime(endTime2) && getTime(startTime2) <= getTime(endingTime);
        }
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const displayAppointments = () => {
    try {
        const month = monthNames[currentMonth];
        const appointments = JSON.parse(localStorage.getItem(`${month} ${currentYear}`));
    
        if (appointments == null || appointments == '[null]') {
            return;
        }
    
        for (appointment in appointments) {
            Number.prototype.pad = function(size) {
                var s = String(this);
                while (s.length < (size || 2)) {s = "0" + s;}
                return s;
            }
    
            if (Number(appointment) === 1 || Number(appointment) === 2 || Number(appointment) === 3 || Number(appointment) === 4 || Number(appointment) === 5 || Number(appointment) === 6 || Number(appointment) === 5 || Number(appointment) === 6 || Number(appointment) === 7 || Number(appointment) === 8 || Number(appointment) === 9) {
                appointment = Number(appointment).pad(2);
            }
    
            const date = `${appointment} ${month} ${currentYear}`;
            let cell = document.getElementById(appointment);
            let container = document.createElement('div');
            let list = document.createElement('ul');
    
            for (time in appointments[Number(appointment)]) {
                let item = document.createElement('li');
                const title = appointments[Number(appointment)][time].title;
                const location = appointments[Number(appointment)][time].location;
                const description = appointments[Number(appointment)][time].description;
                const timeRanges = time.split(' - ');
                const startTime = timeRanges[0];
                const endTime = timeRanges[1];
    
                item.classList.add('appointments');
                item.setAttribute('data-toggle', 'modal');
                item.setAttribute('data-target', '#updateAppointment');
                item.textContent = `${title} ${time}`;
                item.addEventListener('click', (e) => {
                    const appointmentDate = document.getElementById('date');
                    const updateAppointmentTitle = document.getElementById('updateAppointmentTitle');
                    const updateAppointmentLocation = document.getElementById('updateAppointmentLocation');
                    const updateAppointmentDescription = document.getElementById('updateAppointmentDescription');
                    const updateStartingTime = document.getElementById('updateStartingTime');
                    const updateEndingTime = document.getElementById('updateEndingTime');
                    
                    appointmentDate.textContent = date;
                    updateAppointmentTitle.value = title;
                    updateAppointmentLocation.value = location;
                    updateAppointmentDescription.value = description;
                    updateStartingTime.value = startTime;
                    updateEndingTime.value = endTime;
    
                    oldValues.title = title;
                    oldValues.location = location;
                    oldValues.description = description;
                    oldValues.startTime = startTime;
                    oldValues.endTime = endTime;
                });
    
    
                list.appendChild(item)
                container.setAttribute('id', `${appointment}-container`)
                container.appendChild(list);
                cell.appendChild(container);
            }
        }
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const handleInputChange = () => {
    try {
        const updateAppointmentForm = document.getElementById('updateAppointmentForm');
        const updatedTitle = updateAppointmentForm.elements[0].value;
        const updatedLocation = updateAppointmentForm.elements[1].value;
        const updatedDescription = updateAppointmentForm.elements[2].value;
        const updatedStartTime = updateAppointmentForm.elements[3].value;
        const updatedEndTime = updateAppointmentForm.elements[4].value;
    
        return { updatedTitle, updatedLocation, updatedDescription, updatedStartTime, updatedEndTime };
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const updateAppointment = () => {
    try {
        const formValues = handleInputChange();
        const date = document.getElementById('date').textContent;
        const chosenDay = date.split(' ')[0];
        const month = date.split(' ')[1];
        const appointments = JSON.parse(localStorage.getItem(`${month} ${currentYear}`));
        const appointmentsRange = Object.keys(appointments[chosenDay]);
    
        if (!formValues.updatedTitle || !formValues.updatedStartTime || !formValues.updatedEndTime) {
            return notifier.alert('Please enter values in their appropriate format for the required fields');
        }
    
        const isOverlapping = checkIfOverlapping(appointmentsRange, formValues.updatedStartTime, formValues.updatedEndTime);
    
        if (isOverlapping) {
            notifier.alert('Cannot book appointment for time already allocated');
        } else {
            appointments[chosenDay][`${formValues.updatedStartTime} - ${formValues.updatedEndTime}`] = {
                title: formValues.updatedTitle,
                location: formValues.updatedLocation,
                description: formValues.updatedDescription
            };
    
            delete appointments[chosenDay][`${oldValues.startTime} - ${oldValues.endTime}`];
            localStorage.setItem(`${month} ${currentYear}`, JSON.stringify(appointments));
            document.getElementById('updateAppointment').classList.remove('show');
            document.getElementById('updateAppointment').classList.add('hide');
            document.getElementById('updateAppointment').setAttribute('style', 'display: none');
            document.getElementById('updateAppointment').removeAttribute('aria-modal');
            document.getElementById('updateAppointment').setAttribute('aria-hidden', 'true');
    
            // hide modal backdrop
            const modalBackdrops = document.getElementsByClassName('modal-backdrop');    
            document.body.removeChild(modalBackdrops[0]);
    
            window.location.reload();
        }
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}

const deleteAppointment = () => {
    try {
        const date = document.getElementById('date').textContent;
        const chosenDay = date.split(' ')[0];
        const month = date.split(' ')[1];
        const appointments = JSON.parse(localStorage.getItem(`${month} ${currentYear}`));
    
        delete appointments[chosenDay][`${oldValues.startTime} - ${oldValues.endTime}`];
        localStorage.setItem(`${month} ${currentYear}`, JSON.stringify(appointments));
    
        window.location.reload();
    } catch (err) {
        notifier.alert('Something went wrong!');
    }
}