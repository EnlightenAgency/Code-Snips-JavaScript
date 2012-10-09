// This function finds the user's local date/time converted from EDT at a set time in the future. Useful for expiring cookies on a regular basis. Origin: Biore Change For Change cookie for once-per-day votes to expire a cookie at 12:01 AM EDT the next day, every day.

function findLocalExpTime() { 
    var curTime = new Date(),
        expTime = new Date(),
        baseZoneOffset = 4,	// Base timezone offset from UTC (4 in this example for EDT, change as appropriate)
        tmpYear = curTime.getUTCFullYear(),
        tmpMonth = curTime.getUTCMonth(),
        tmpDate = curTime.getUTCDate(),
        tmpHrs = curTime.getUTCHours(),
        tmpMin = curTime.getUTCMinutes(),
        localTime;

    if (curTime.getUTCHours() > baseZoneOffset || (curTime.getUTCHours() == baseZoneOffset && curTime.getUTCMinutes() >= 1)) {
        expTime.setUTCFullYear(tmpYear,tmpMonth,tmpDate+1);
        expTime.setUTCHours(baseZoneOffset,1,0,0);
    } else {
        expTime.setUTCFullYear(tmpYear,tmpMonth,tmpDate);
        expTime.setUTCHours(baseZoneOffset,1,0,0);
    }    
    
    localTime = new Date(expTime.toUTCString());

    return localTime;
}