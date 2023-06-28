const fs = require('fs');
const filePath = 'schedule.txt';

var prompts = []
for (var year = 2023; year <= 2098; year++) {
    // add separator for year
    var year_breaker = "===========" + year + "==========="
    prompts.push(year_breaker);
    for (var month = 1; month <= 12; month++) {

        // default scheduling of 12 messages every 4 years
        var new_year = year + 4 * month;

        // print current date MM/YYYY and pad it
        var dd = new Date(year, month - 1)
        var prompt = dd.toLocaleString('default', { month: 'long', year: 'numeric' }) + ": ";
        prompt = prompt.padEnd(16, " ");

        // planning to schedule until 2098
        var end_year = 2098

        // manual even spreading of entries. e.g. if there are 2 messages du, dict[2] shows that there is one due in January (1) and July(7)
        var dict = {};
        dict[1] = [6];
        dict[2] = [1, 7];
        dict[3] = [1, 5, 9];
        dict[4] = [1, 4, 7, 10];
        dict[5] = [1, 3, 6, 8, 11]
        dict[6] = [1, 3, 5, 7, 9, 11];
        dict[7] = [1, 3, 4, 6, 8, 9, 11];
        dict[8] = [2, 3, 5, 6, 8, 9, 11, 12];
        dict[9] = [2, 3, 4, 6, 7, 8, 10, 11, 12];
        dict[10] = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
        dict[11] = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];
        dict[12] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // edge cases all 12 months can be recorded this year and might have to be split up among the years
        if (4 * 12 + year < end_year) // this is relevant until 12/2049
        {
            // add new year to prompt
            prompt = prompt + new_year;

            // additional: there is time from 2074 to 2098 where Stefan will never here from his self that was 12x4=48 years younger
            // thus: record videos for remaning years. 
            var years_left = end_year - 4 * 12 - year; // must be greater than 0'
            // case in between the years 2046 and 2050 which result in years left 0 and 4
            if (!(years_left < 8))
            // in between 2022 and 2046 youre supposed to do more to
            // cover the period from 2022+48 and 2046+48
            {
                // only do videos every 8 years in that period
                var times = parseInt(Math.floor(years_left / 8));
                if (dict[times].includes(month)) {
                    var index = dict[times].indexOf(month) + 1;

                    // schedule the additional message every 8 years after the 48 years long regular period ends
                    var additional_year = year + 4 * 12 + index * 8;
                    prompt = prompt + ", " + additional_year;
                }
            }
        }
        else // this is relevant beginning with the year 2050!
        {
            // e.g. in 2050, there are 2098-2050= 48 years to schedule
            var years_left = end_year - year;
            if (!(years_left < 4)) {
                // how many times I can record the message, in 48 years i can record 48/4 = 12 messages
                var times = parseInt(Math.floor(years_left / 4));
                // not enough years left to record 12 * 4 videos this year.. (recording one video a month for every 4 years.)
                // record less videos

                // get month of this years to do
                if (dict[times].includes(month)) {
                    // if this month is to do
                    // e.g. the year 2090 has 8 years left, thus times = 2. 
                    // the first video is dict[2] due in 1st month for 2094, and the 
                    // second video is due 7th month for 2098 
                    var times_four = dict[times].indexOf(month) + 1;
                    new_year = 4 * times_four + year;
                    prompt = prompt + new_year;

                }
            }
        }
        // append line
        prompts.push(prompt);
    }


}

const content = prompts.join('\n');

// write output to file
fs.writeFile(filePath, content, function (err) {
    if (err) {
        console.error('Error writing to file:', err);
    }
});


