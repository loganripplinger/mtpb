# Murder Trivia Party Bot (mtpb) v0.1

Runs a website that allows users to invite a bot to their Jackbox Murder Trivia Party game by sending a room code.

**This was not written with quality code. It created fast and dirty.**
**The bot is primative and currently chooses random answers.**

This library is intended to either:
1. Extended the base gameplay by providing a unique or novel experience
2. Provide accessibility to users with disabilities
3. To allow the game to be experienced in the future when the player base is no longer active (much in the same way you can play a full match of Battlefield 2 with bots)

**Please** do not use this library to abuse, troll, or cheat the service. Seriously, please do not do that.

Use of this library may be against Jackbox's Terms of Service. If you intended to use library outside the scope of my intentions, please ensure you notify all users that this is altering the intended experience the developers created and then gain the permission and approval of all the users that will be interacting with the bots.

This can be easily extended to interact with any of the other jackbox games.

## To use
Use `npm install` to install required things.

Run the server with `node index.js`

In your web browser, replace `4-digit-room code` with the room you want to join.
```
localhost:3000/room/4-digit-room code
```
This will spawn a bot that will attempt to join the room. You can spawn as many bots to join the room as you'd like by submitting the room code again.

**All data currently prints out to the console and will not be sent to the website.**
