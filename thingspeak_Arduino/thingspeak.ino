#include <ESP8266WiFi.h>
#include <ThingSpeak.h>


const char* ssid = "pixar 2.4G";
const char* password = "ehowl8282";

unsigned long channelID = 2665690;  // Replace with your ThingSpeak Channel ID
const char* writeAPIKey = "LNV5C9AWHN3FCL6N";  // Replace with your ThingSpeak Write API Key
const char* hostName = "LG_Smart_Fridge2_open";

WiFiClient client;

void setup() {
  pinMode(A0,INPUT);
  Serial.begin(115200);
  delay(10);

  // Connect to Wi-Fi
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.hostname(hostName);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  ThingSpeak.begin(client);
}

void loop() {
  // Read sensor data (replace this with your actual sensor reading)
  float sensorValue = analogRead(A0);
  Serial.println(sensorValue);

  // Send data to ThingSpeak
  int status = ThingSpeak.writeField(channelID, 1, sensorValue, writeAPIKey);
  
  if(status == 200){
    Serial.println("Channel update successful.");
  }
  else{
    Serial.println("Problem updating channel. HTTP error code " + String(status));
  }

  // Wait for 20 seconds (ThingSpeak has a limitation of 15 seconds between updates)
  delay(20000);
}