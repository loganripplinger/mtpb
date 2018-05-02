# Murder Trivia Party Bot (mtpb) v0.1

Runs a website that allows users to send a room code for a bot to join on and play Murder Trivia Party with.

This library is intended to either:
1. Extended the base gameplay by providing a unique or novel experience
2. Provide accessibily to users with disabilites
3. To allow the game to be experienced in the future when the playerbase is no longer active (much in the same way you can play a full match of Battlefield 2 with bots).

**Please** do not use this library to abuse, troll, or cheat the service. Seriously, please do not do that.

Use of this library may be against Jackbox's Terms of Service. If you intended to use library outside the scope of my intentions, please ensure you notify all users this is altering the intented experience the developers created, and gain the permission and approval of all the users that will be interacting with the bots.

This can be easily extended to interact with any of the other jackbox games.

## To use
Use `npm install` to install required things.

Run the server with `node index.js`

In your web browser, replace `4-digit-roomcode` with the room you want to join.
```
localhost:3000/room/4-digit-roomcode
```

All data currently prints out to the console and will not be sent via the website.