// /*
//   TODO : Description du fichier

// Auteur : Elliot Gaulin
// Date : 2023/04/11
// Inspiré de https://docs.arduino.cc/tutorials/communication/wifi-nina-examples
// Note : Les commentaires en anglais sont les commentaires originaux
// */

#include <SD.h>
#include <DHT_U.h>
#include <DHT.h>
#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>

#define TEMPERATURE_FILENAME "file.txt"

#define SDPIN 2
#define LED_PIN 4
#define DHTPIN 3
#define DHTTYPE DHT11
#define SECURITY_PIN 5
#define BUZZER_PIN 6

char ssid[] = "FAMILLE GAULIN";
char pass[] = "Florida2020";

int status = WL_IDLE_STATUS;
unsigned long previousMillisRead = 0; // will store last time the POST request was done
const int intervalRead = 5000;        // 60000MS = 1 min
bool alarm = false;
WiFiServer server(80);

char baseUrl[] = "10.0.0.189";
int port = 3001;
WiFiClient wifi;
HttpClient httpClient = HttpClient(wifi, baseUrl, port);

File file; // Fichier sur la carte SD

DHT dht(DHTPIN, DHTTYPE); // Capteur de température et d'humidité

void setup()
{
  Serial.begin(9600); // initialize serial communication
  Serial.println("Starting...");
  dht.begin(); // Initialisation du DHT11
  pinMode(LED_PIN, OUTPUT);
  pinMode(SECURITY_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  // Initialisation du lecteur de carte SD
  if (!SD.begin(SDPIN))
  {
    while (1)
    {
      Serial.println("Impossible de communiquer avec le lecteur de carte.");
      delay(1000);
    }
  }

  wifiSetup();
  server.begin();    // start the web server on port 80
  printWifiStatus(); // you're connected now, so print out the status
}

void loop()
{
  if (digitalRead(SECURITY_PIN) == LOW)
  {
    if (!alarm)
    {

      digitalWrite(BUZZER_PIN, HIGH);
      doPost("", "/intrusion");
      alarm = true;
    }
    return;
  }
  else
  {
    alarm = false;
    digitalWrite(BUZZER_PIN, LOW);
  }

  handleHttpClient(); // Gère les requêtes HTTP

  // Attente du délai entre chaque lecture
  if (millis() > intervalRead + previousMillisRead)
  {
    Serial.println("------------------------------------");
    previousMillisRead = millis();

    // Lecture de la température et de l'humidité
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    // Check if any reads failed and exit early (to try again).
    if (isnan(humidity) || isnan(temperature))
    {
      Serial.println(F("Impossible de lire les donnees du capteur!"));
      return;
    }

    // bool success = false;
    bool success = sendDataToServer(humidity, temperature);
    if (!success)
    {
      Serial.println("Impossible d'envoyer les donnees au serveur.");
      sendDataToSDCard(humidity, temperature);
    }
    else
    {
      Serial.println("Données envoyées au serveur.");
    }
  }
}

/**
 * Affiche sur le port série les informations de connexion au réseau WiFi
 * Source : https://github.com/arduino-libraries/ArduinoHttpClient/blob/master/examples/SimplePost/SimplePost.ino
 */
void printWifiStatus()
{

  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  // print where to go in a browser:
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}

void wifiSetup()
{
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE)
  {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }
  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION)
  {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid); // print the network name (SSID);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(10000);
  }
}

void handleHttpClient()
{
  WiFiClient client = server.available(); // listen for incoming clients
  if (client)
  {
    Serial.println("new client"); // print a message out the serial port
    String currentLine = "";      // make a String to hold incoming data from the client
    while (client.connected())
    { // loop while the client's connected=
      if (client.available())
      {                         // if there's bytes to read from the client,=
        char c = client.read(); // read a byte, then
        Serial.write(c);        // print it out the serial monitor
        if (c == '\n')
        { // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0)
          {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();

            // the content of the HTTP response follows the header:
            client.print("Hello world!");

            // The HTTP response ends with another blank line:
            client.println();
            // break out of the while loop:
            break;
          }
          else
          { // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        }
        else if (c != '\r')
        {                   // if you got anything else but a carriage return character,
          currentLine += c; // add it to the end of the currentLine
        }

        if (currentLine.endsWith("GET /on"))
        {
          Serial.println("ON");
          digitalWrite(LED_PIN, HIGH); // GET /demarrer en mode serial
        }

        if (currentLine.endsWith("GET /off"))
        {
          Serial.println("OFF");
          digitalWrite(LED_PIN, LOW); // GET /stop met le arduino en mode serial
        }
      }
    }
    // Ferme la connection :
    client.stop();
    Serial.println("client disconnected");
  }
}

bool sendDataToServer(float humidity, float temperature)
{
  String json = "[{\"humidity\":" + String(humidity, 2) + ",\"temperature\":" + String(temperature, 2) + "}]";

  // Envoie des données au serveur web
  Serial.println("Envoie des donnees au serveur web");
  Serial.print("Humidite : ");
  Serial.println(humidity);
  Serial.print("Temperature : ");
  Serial.println(temperature);

  int httpStatus = doPost(json, "/temperature");
  bool success = httpStatus / 100 == 2; // Les codes 2XX sont des codes de succès

  if (success && SDCardHasData())
  {
    if (SDCardHasData())
    {
      json = GetJsonFromSDCard();
      httpStatus = doPost(json, "/temperature");

      if (httpStatus / 100 == 2)
      {
        SD.remove(TEMPERATURE_FILENAME);
      }
    }
  }

  return httpStatus / 100 == 2; // Les codes 2XX sont des codes de succès
}

int doPost(String json, String route)
{
  httpClient.stop(); // Sinon on a une erreur -2
  String content_type = "application/json";
  httpClient.post(route, content_type, json);
  int httpStatus = httpClient.responseStatusCode();
  Serial.print("Code d'etat HTTP : ");
  Serial.println(httpStatus);

  String response = httpClient.responseBody();
  Serial.print("Reponse : ");
  Serial.println(response);

  return httpStatus;
}

void sendDataToSDCard(float humidity, float temperature)
{
  Serial.println("Essai d'envoi des donnees sur la carte SD");
  Serial.print("Humidite : ");
  Serial.println(humidity);
  Serial.print("Temperature : ");
  Serial.println(temperature);

  file = SD.open(TEMPERATURE_FILENAME, FILE_WRITE);
  if (file)
  {
    Serial.println("Ecriture dans le fichier");
    file.print("{\"humidity\": ");
    file.print(humidity);
    file.print(", \"temperature\": ");
    file.print(temperature);
    file.println("}");
    file.close();
  }
  else
  {
    Serial.print("Impossible d'ouvrir le fichier :");
    Serial.println(TEMPERATURE_FILENAME);
  }
}

String GetJsonFromSDCard()
{
  Serial.println("Lecture du fichier");
  file = SD.open(TEMPERATURE_FILENAME, FILE_READ);
  if (file)
  {
    String json = "[";
    String fileContents = file.readString();
    while (fileContents.length() > 0)
    {
      int newLineIndex = fileContents.indexOf("\n");
      String line = fileContents.substring(0, newLineIndex);
      json += line;
      fileContents = fileContents.substring(newLineIndex + 1);
      if (fileContents.length() > 0)
      {
        json += ",";
      }
    }
    Serial.println(fileContents);
    file.close();
    json += "]";
    Serial.println(json);
    file.close();
    return json;
  }
  else
  {
    Serial.print("Impossible d'ouvrir le fichier :");
    Serial.println(TEMPERATURE_FILENAME);
    return "[]";
  }
}

bool SDCardHasData()
{
  file = SD.open(TEMPERATURE_FILENAME, FILE_READ);
  if (file)
  {
    file.close();
    return true;
  }
  else
  {
    return false;
  }
}