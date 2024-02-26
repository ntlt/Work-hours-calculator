document.addEventListener('DOMContentLoaded', function () {
    // Initialize work hours for each day
    document.querySelectorAll('.day-row').forEach(function (dayRow) {
        calculateWorkHours(dayRow);
    });

    // Set up event delegation for time inputs
    document.body.addEventListener('change', function (event) {
        const target = event.target;
        if (target.matches('.startTime, .endTime')) {
            const dayRow = target.closest('.day-row');
            calculateWorkHours(dayRow);
            updateWeeklyTotal();

            if (getDayName(new Date().getDay()) === 'Friday') {
                const remainingHours = calculateRemainingHours();
                displayLeaveInfo(remainingHours);
            }
        }
    });
});

function calculateWorkHours(dayRow) {
    const startTime = dayRow.querySelector('.startTime').value;
    const endTime = dayRow.querySelector('.endTime').value;
    const resultElement = dayRow.querySelector('.result');

    const start = new Date(`${new Date().toISOString().slice(0, 10)} ${startTime}`);
    const end = new Date(`${new Date().toISOString().slice(0, 10)} ${endTime}`);

    // Subtract lunch break (11:30 - 12:30)
    const lunchStart = new Date(`${new Date().toISOString().slice(0, 10)} 11:30`);
    const lunchEnd = new Date(`${new Date().toISOString().slice(0, 10)} 12:30`);

    if (start < lunchStart && end > lunchEnd) {
        // Adjust end time if it's after lunch break
        end.setHours(end.getHours() - 1);
    }

    const diffInMilliseconds = end - start;
    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    // Cap the maximum work hours to 10 hours
    const maxWorkHours = Math.min(hours + minutes / 60, 10);

    const formattedHours = Math.floor(maxWorkHours);
    const formattedMinutes = Math.round((maxWorkHours - formattedHours) * 60);

    resultElement.innerText = `${formattedHours} hours ${formattedMinutes} minutes`;
}

function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

function updateWeeklyTotal() {
    const totalElements = document.querySelectorAll('.result');
    let weeklyTotalMinutes = 0;

    totalElements.forEach((totalElement) => {
        const timeString = totalElement.innerText;
        const regexResult = timeString.match(/(\d+) hours (\d+) minutes/);

        if (regexResult) {
            const hours = parseInt(regexResult[1]);
            const minutes = parseInt(regexResult[2]);
            weeklyTotalMinutes += hours * 60 + minutes;
        }
    });

    const weeklyTotalHours = Math.floor(weeklyTotalMinutes / 60);
    const weeklyTotalFormattedMinutes = weeklyTotalMinutes % 60;

    const weeklyTotalElement = document.getElementById('weekly-total-hours');
    weeklyTotalElement.innerText = `${weeklyTotalHours}h${weeklyTotalFormattedMinutes.toString().padStart(2, '0')}`;
}


