# README

Simple [minesweeper] in Vanilla JS

- [Housekeeping]
- [Quickstart]
- [Features]
- [Missing Features]
- [Development Time]

## Housekeeping

* Install node

> Yep, no need to npm install anything


## Quickstart

* Clone repo
  ```command
  git@github.com:athomasoriginal/minesweeper.git
  ```
* Move into root dir
* Run app
  ```command
  node minesweeper.js
  ```

Visit localhost:3000


## Features

* Board dynamically generated
  * Harded to 5 x 5
* Board `game_size` and `bomb_count` can be modified
  * Modify board size by updating `game_size` in `src/index.js`
  * Modify bomb count by changing `bomb_count` in `src/index.js`
* Reveal tiles
  * Click tile to reveal
* Tile states
  * `0` tile reveals all adjacent tiles
  * `-1` tile is a bomb and loses the game
  * `1` (or greater) tiles reveal without additional effects
* Lose game state
  * Reveal game over modal
  * Allow user to reset game
  * Board can't be interacted with again until game reset
* No dependencies


## Missing Features

* No win game state
* No Tile flags
* Non square board
* Persist progress
  * localstorage
  * serverside

## Development Time

**Total:** 3.5 hours

* Game board
  * Time: 40min
  * Iterations: 3
  * Features: draw, events, reset, game state, edge cases
* Reveal individual tiles
  * Time: 20min
  * Iterations: 3
* Reveal 0 val tiles
  * Time: 1.5hr
  * Iterations: 5
* Generate random boards
  * Time: 40min
  * Iterations: 2
* Polish
  * Time: 30min


[Housekeeping]: #housekeeping
[Quickstart]: #quickstart
[Features]: #features
[Missing Features]: #missing-features
[Development Time]: #development-time
[minesweeper]: https://mpdaugherty.com/minesweeper/
