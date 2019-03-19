# jarvis-home-monitor
Alexa Jarvis Home Monitor is interaction skill to ask Alexa device for different sensor data e.g temperature, humidity etc in your house using Adafruit API and respond back to the user.

## 
Custom Alexa Skill can be built using Alexa Skill Interaction Model.json. The schema provides various intents for Floor (Basement, 2nd floor, attic etc) and Temperature/Humidity, Water softneer Salt level, Device On/Off, Setting Color intent as well as slots such as Backyard hottub, different rooms. This lambda is integrated tightly with Adafruit I/O.

Each slot types has unique id provided in Alexa skill which maps to Adafruit feed group to avoid hard coding within lamdba function. 

E.g. Amazon.Room 

| Value        | Id           |
|--------------|--------------|
| attic        | attic        |
| basement     | basement     |
| second floor | second-floor |
                   
and TYPE_OF_TEMPERATURE

| Value        | Id           |
|--------------|--------------|
| humidity     | humidity     |
| temperature  | temperature |
| salt         | salt-level-status |

So when user invoke the skill
``` 
Ask, Jarvis to check temperature in the basement
Ask, Jarvis to check salt level in Softener
Ask, Jarvis to check hottub
``` 

then Alexa request provides all the Id's to build the correct end point for adafruit api, which are basically group by different rooms. Once the feed is indentified using above method, lamdba function request the values from Adafruit IO feed and make custom annoucement with date and time stamp of the recorded values using sensors installed. 

Sensor are mostly in my case are all ESP8266 with custom PCB which records values and publishses to Adafriut IO. Most of my sensors are designed to run for long time, so they use TPL511x chip and mosfet and/or voltage regulators to turn on at periodic interval, measure the data and shut it off.
