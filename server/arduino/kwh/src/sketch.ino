
// original script form http://openenergymonitor.org/emon/node/123

// try printing values from within the interrupt method first to check config.
// If thsese values pass by too fast you have noise on your input and
// you have to use a resistor (around 10k Ohm) between input and ground.

// S+ ------------------------ +5V
// S- -------+---< R1 >------- GND	R1 = 10K
// 	         |
//	         |
//	      IRQ0
//        PIN2 arduino

// Number of pulses, used to measure energy.
long pulseCount = 0;

// Used to measure power. // removed
//unsigned long pulseTime, lastTime;

// energy
double elapsedkWh;

// power
// double power;

// Number of pulses per wh - found or set on the meter.
int ppwh = 1; //1000 pulses/kwh = 1 pulse per wh

void setup()
{
  Serial.begin(9600);

  // KWH interrupt attached to IRQ 1  = pin3
  attachInterrupt(1, onPulse, FALLING);
}

void loop()
{

  // start with the delay
  delay(60000);

  // since we want the elapsed kwh value printed on a fixed interval we'll
  // do that in the main program loop
  elapsedkWh = (1.0*pulseCount/(ppwh*1000)); //mulitply by 1000 to convert wh to kwh
  Serial.println(elapsedkWh, 3);
}

// The interrupt routine
void onPulse()
{

  // used to measure time between pulses.
  //lastTime = pulseTime;
  //pulseTime = micros();

  // pulseCounter
  pulseCount++;

  // uncomment these lines if you want to enable logging on each interrupt again

  // Calculate power
  //  power = (3600000000.0 / (pulseTime - lastTime))/ppwh;

  // Find kwh elapsed
  //elapsedkWh = (1.0*pulseCount/(ppwh*1000)); //multiply by 1000 to pulses per wh to kwh convert wh to kwh

  // Print the values.
  //  Serial.print(power,4);
  //  Serial.print(" ");

  // we really only need to elapsedkWh value for our project. Print this in a fixed timespan
  //Serial.println(elapsedkWh,3);
}