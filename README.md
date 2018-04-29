# Murder Trivia Party Bot (mtpb) v0.000001

Currently it can connect and recieve data correctly, and nothing else. Just got it working. More to come.

To connect you must first do some http requests to find the connection data for the websocket.

## To use
Open the file `jackbox_connection.js`. At the bottom, enter your room code. Run it with `nodejs jackbox_connection.js`. This will give you the required websocket data. Enter this data into `index.js`. Then run it with `nodejs index.js` and it should connect and begin receiving data. It will only be printed to the console.