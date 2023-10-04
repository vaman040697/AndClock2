const degree = 6;
// Get the current time
var date = new Date();
//date.setHours();

let lat;
let lng;

var hour = date.getHours();
const hr = document.querySelector('#hr');
const min = document.querySelector('#min');
const sec = document.querySelector('#sec');
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var tHolder = [];



setInterval(() =>{
    const datec = new Date();
    const now = new Date();
    const monthName = monthNames[now.getMonth()];
    const dateNumber = now.getDate();
    const hh = datec.getHours() * 30;
    const mm = datec.getMinutes() * degree;
    const ss = datec.getSeconds() * degree;

    hr.style.transform = `rotateZ(${hh + (mm / 12)}deg)`;
    min.style.transform = `rotateZ(${mm}deg)`;
    sec.style.transform = `rotateZ(${ss}deg)`;

    month.textContent = monthName;
    datet.textContent = dateNumber;       
});


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}

getLocation();

function showPosition(position) {
   lat = position.coords.latitude;
   lng = position.coords.longitude;
}




// Get the circle element
var circle1 = document.querySelector(".circle:nth-child(1)");
var circle2 = document.querySelector(".circle:nth-child(2)");


const month = document.querySelector('.circle:nth-child(1)');
const datet = document.querySelector('.circle:nth-child(2)');

circle1.classList.add("month");
circle2.classList.add("date");

tHolder = suntimes(lat, lng);

rise = tHolder[0];
set = tHolder[1];

// Check the time and update the circle color
if (hour >= rise && hour < set) {
    // no class to add
} else {
    circle1.classList.add("night");
    circle2.classList.add("night");
} 


function suntimes(lat, lng, tz) {
    var d = new Date();
    var radians = Math.PI / 180.0;
    var degrees = 180.0 / Math.PI;

    var a = Math.floor((14 - (d.getMonth() + 1.0)) / 12)
    var y = d.getFullYear() + 4800 - a;
    var m = (d.getMonth() + 1) + 12 * a - 3;
    var j_day = d.getDate() + Math.floor((153 * m + 2)/5) + 365 * y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
    var n_star = j_day - 2451545.0009 - lng / 360.0;
    var n = Math.floor(n_star + 0.5);
    var solar_noon = 2451545.0009 - lng / 360.0 + n;
    var M = 356.0470 + 0.9856002585 * n;
    var C = 1.9148 * Math.sin( M * radians ) + 0.02 * Math.sin( 2 * M * radians ) + 0.0003 * Math.sin( 3 * M * radians );
    var L = ( M + 102.9372 + C + 180 ) % 360;
    var j_transit = solar_noon + 0.0053 * Math.sin( M * radians) - 0.0069 * Math.sin( 2 * L * radians );
    var D = Math.asin( Math.sin( L * radians ) * Math.sin( 23.45 * radians ) ) * degrees;
    var cos_omega = ( Math.sin(-0.83 * radians) - Math.sin( lat * radians ) * Math.sin( D * radians ) ) / ( Math.cos( lat * radians ) * Math.cos( D * radians ) );

    // sun never rises
    if( cos_omega > 1)
      return [null, -1];

    // sun never sets
    if( cos_omega < -1 )
      return [-1, null];

    // get Julian dates of sunrise/sunset
    var omega = Math.acos( cos_omega ) * degrees;
    var j_set = j_transit + omega / 360.0;
    var j_rise = j_transit - omega / 360.0;
    /*
    * get sunrise and sunset times in UTC
    * Check section "Finding Julian date given Julian day number and time of
    *  day" on wikipedia for where the extra "+ 12" comes from.
    */
    var utc_time_set = 24 * (j_set - j_day) + 12;
    var utc_time_rise = 24 * (j_rise - j_day) + 12;
    var tz_offset = tz === undefined ? -1 * d.getTimezoneOffset() / 60 : tz;
    var local_rise = (utc_time_rise + tz_offset) % 24;
    var local_set = (utc_time_set + tz_offset) % 24;
    return [local_rise, local_set];

}