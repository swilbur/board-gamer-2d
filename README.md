# Board Gamer 2d

2d multiplayer html5 board game simulator.

## Demo

http://boardgames.telemin.net/
Ask me for the password if you're not a spambot.

## Status

Working:

 * Create and join rooms. Empty rooms are deleted after an week.
 * Some objects are supported out of the box: Deck of 52 playing cards, d6 dice, checker board and checkers.
 * Decent controls to manipulate objects: Examine, group together, move around, flip over.
 * Numeric labels on objects: useful for tracking hit points, Twilight Struggle influence, etc.
 * RNG Controls: Shuffle a stack, roll objects to show a random side.
 * Multiplayer experience is synced when you let go of the mouse, requiring fairly low network traffic.
 * Objects can be "locked" to serve as a background, and they can define a snap-to-grid area.
 * Individual players can have a special area where only they can see all sides of the objects in it;
   in other words, their hand of cards is hidden from opponents.
 * Game log is maintained server-side per room, and is accessible by any client even after joining late or refreshing the page.
 * Rudimentary chat ability in the game log

Planned:

 * log in with your username, get a list of your active games

## Philosophy

Board Gamer 2d does not know the rules of any particular game.
It provides objects, controls, and a multiplayer environment for players to play games that only they know the rules for.
The primary intended use for this project is to allow board game creators to prototype game ideas with their friends.

Board Gamer 2d does not take responsibility for enforcing any rules of the game whatsoever.
Board Gamer 2d permits malicious players to cheat flagrantly if they choose to,
such as looking at other players' hands, rearranging the deck secretly, kicking players out of the game, etc.
It is expected that players have cooperative attitudes and want to play fairly.

The Board Gamer 2d engine will try to support almost every style of tabletop game,
from Candyland to Settlers of Catan to Dutch Blitz, but will not include any copyrighted material.
The intention is that users will upload their own ideas for games, and try them out with this project,
eventually perhaps realizing their ideas in the real world through the use of a print shop or whatever.

Some styles of games are outside the scope of this project, such as Mousetrap or Hungry Hungry Hippos, which rely on 3d physics.

Board Gamer 2d is not trying to compete with board game companies by providing a free alternative to buying the real game.
Rather, this enables board game creators to prototype ideas before spending money to see their ideas realized with physical objects.

## vs Tabletop Simulator

Tabletop Simulator is available on Steam for a reasonable price.
Board Gamer 2d is free.

Tabletop Simulator is closed source.
Board Gamer 2d is open source.

Tabletop Simulator requires an account for multiplayer.
Board Gamer 2d allows anyone to join a room they know the code for; then they type in their name, which they can make up on the spot.

Tabletop Simulator must be trusted to run natively on your system after being installed.
Board Gamer 2d runs in the browser.

Tabletop Simulator has a community through Steam Workshop.
Board Gamer 2d has no clear plan for a community solution.

Tabletop Simulator is a 3d physics sandbox.
Board Gamer 2d is a 2d object manipulation sandbox.
Tabletop Simulator has a problem where game pieces can fall over and need to be picked up and put back upright.
Tabletop Simulator has a "flip table" feature, which is really just a joke.

Tabletop Simulator uses "unpredictable" physics for dice rolls and coin flips.
Board Gamer 2d uses a random number generator for dice rolls and coin flips.

Tabletop Simulator's system for creating a deck of cards has numerous problems.
The Board Gamer 2d engine allows arbitrary images or spritesheets with arbitrary coordinates and dimensions for all objects.

## Copyrighted Game Assets

Some of the game files (e.g. twilight_struggle.js) use copyrighted assets.  These are not redistributed here, but most can be found online (e.g. at the publisher's website, boardgamegeek.com, twilightstrategy.com, etc.)
