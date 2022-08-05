// NOTE: this does not work at all: mp3.playFolderShuffle(PLAY_FOLDER);

#include <MD_YX5300.h>
#include <SoftwareSerial.h>

#define DEBUG 1

const uint8_t ARDUINO_RX = 2;    // connect to TX of MP3 Player module
const uint8_t ARDUINO_TX = 3;    // connect to RX of MP3 Player module

SoftwareSerial  MP3Stream(ARDUINO_RX, ARDUINO_TX);  // MP3 player serial stream for comms

MD_YX5300 mp3(MP3Stream);

long setToPlay = 0;
bool startingPlay = false;
int lastPlayed = 0;

int arr[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18};
int arrSize = sizeof(arr) / 2;

void swap(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

void randomize(int arr[], int n)
{
    // Use a different seed value so that we don't get same
    // result each time we run this program
    randomSeed(analogRead(A0));
 
    // Start from the last element and swap one by one. We don't
    // need to run for the first element that's why i > 0
    for (int i = n-1; i > 0; i--)
    {
        long j = random(0, n);
        swap(&arr[i], &arr[j]);
    }
}

void cbResponse(const MD_YX5300::cbData *status)
{
//  Serial.println("cb");
  if (startingPlay == false)
  {
    switch (status->code)
    {
      case MD_YX5300::status_t::STS_FILE_END:
        startingPlay = true;
        Serial.println("STS_FILE_END");
        if (setToPlay == 1)
        {
          delay(2000);
          mp3.playSpecific(1, arr[lastPlayed]);
          delay(2000);
          startingPlay = false;
        } else {
          delay(2000);
          mp3.playSpecific(2, arr[lastPlayed]);
          delay(2000);
          startingPlay = false;
        }
        Serial.println(lastPlayed);
        Serial.println(arrSize);
        if (lastPlayed >= arrSize) {
          lastPlayed = 0;
        }
        else {
          lastPlayed++; 
        }
        break;
  
      default:
        break;
    }
  }
}

void setup()
{
  Serial.begin(9600);
  while (!Serial) {
    ;
  }

  randomSeed(analogRead(0));
  setToPlay = random(0, 2);

  int n = sizeof(arr)/ sizeof(arr[0]);
  randomize (arr, n);

  MP3Stream.begin(MD_YX5300::SERIAL_BPS);
  mp3.begin();
  mp3.setSynchronous(true);
  mp3.setCallback(cbResponse);

  if (setToPlay == 1)
  {
    mp3.playSpecific(1, arr[lastPlayed]);
  } else {
    mp3.playSpecific(2, arr[lastPlayed]);
  }
  lastPlayed++;
}

void loop()
{
  mp3.check();
}
