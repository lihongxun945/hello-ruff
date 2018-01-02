'use strict';

function colorTemperatureToRGB(kelvin){
  var temp = kelvin;
  var red, green, blue;
  if( temp <= 66 ){ 
    red = 255; 
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if( temp <= 19){
      blue = 0;
    } else {
      blue = temp-10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }

  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);

    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492 );
    blue = 255;
  }

  var r = [
    clamp(red,   0, 255),
    clamp(green, 0, 255),
    clamp(blue,  0, 255)
  ]
  console.log('RGB:' + r);
  return r
}

function clamp( x, min, max ) {
  if(x<min){ return min; }
  if(x>max){ return max; }
  return Math.round(x)
}

var lastTemperature = 0, lastHumidity = 0;
function printDHT() {
  $('#dht11').getTemperature(function(error, t) {
    lastTemperature = t || lastTemperature
    var temperature = lastTemperature
    console.log('temperature', temperature);
    $('#lcd').setCursor(0, 0);
    $('#lcd').print('tem:' + temperature + 'C' + '  ');
  })
  $('#dht11').getRelativeHumidity(function (error, h) {
    lastHumidity = h || lastHumidity
    var humidity = lastHumidity
    console.log('humidity', humidity);
    $('#lcd').setCursor(8, 0);
    $('#lcd').print(' hum:' + humidity + '%' + ' ');
  });
}

function buzze(time) {
  $('#FC-49').turnOn(function (error) {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Buzzer turned on');
  });

  setTimeout(function () {
    $('#FC-49').turnOff(function (error) {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Buzzer turned Off');
    })
  }, time || 1000)
}

function light(t) {
  $('#KY-016').turnOn()
  setInterval(function () {
    $('#KY-016').setRGB(colorTemperatureToRGB(lastTemperature))
  }, 2000)
}

function sound() {
  $('#lcd').setCursor(0, 1);
  $('#lcd').print('sound: NO             ');
  $('#SOUND-01').on('sound', function (err, s) {
    $('#lcd').setCursor(0, 1);
    $('#lcd').print('sound: YES             ');
    setTimeout(function () {
      $('#lcd').setCursor(0, 1);
      $('#lcd').print('sound: NO             ');
    }, 150)
  })
}

$.ready(function (error) {

  var lcd = $('#lcd')
  lcd.turnOn()
  lcd.print('Hello Hongxun!');
  lcd.setCursor(0, 1);
  lcd.print('This is Ruff.');

  setInterval(function () {
    printDHT();
  }, 5000);

  light()

  sound()

});

$.end(function () {
  $('#lcd').turnOff()
});
