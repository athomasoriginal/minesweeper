// ----------------------------------------------------------------------------
// Minesweeper
//
// Concepts:
//   * tile          - tuple - [int, int]
//
//   * tile_coord    - tuple - [int, int]
//
//   * adjacent_tile - a tile neighboring another tile
//
//   * board_tiles   - 2d vector
// ----------------------------------------------------------------------------

// Game State
// ---------------------------------------------------------------------------

// @note Matrix representing rows and columns for the game board
//
// Each tile is a tuple e.g. [int, int].  The first position is the value of
// the tile and the second position is whether or not the tile has been
// revealed.
//
// Generated when game is initialized
let board_tiles = [];

let game_over = false;

// e.g. setting to 5 would be a square board of 5 x 5
let game_size = 5;

let number_of_bombs = 2;

const adjacent_coord_positions = [
  [-1, -1],
  [-1, 0],
  [-1, +1],
  [0, -1],
  [0, +1],
  [+1, -1],
  [+1, 0],
  [+1, +1],
];

// Utils
// ---------------------------------------------------------------------------

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Game Logic
// ---------------------------------------------------------------------------

// @note get all adjacent tiles to the given tile's coordinates
function get_adjacent_tile_coords(row, cell, coord_positions, max) {
  const cells_walked = [];

  for (let idx = 0; idx < coord_positions.length; idx++) {
    let adjacent_row = coord_positions[idx][0] + row;
    let adjacent_cell = coord_positions[idx][1] + cell;

    // @note coords are not on the game board.  Skip.
    if (
      adjacent_row < 0 ||
      adjacent_row > max ||
      adjacent_cell > max ||
      adjacent_cell < 0
    ) {
      continue;
    }

    cells_walked.push([adjacent_row, adjacent_cell]);
  }

  return cells_walked;
}

// @note walk all adjacent tiles and reveal
function walk_adjacent_tiles(row, cell, adjacent_tile_coords, tiles) {
  // @note find tiles and update them
  for (let idx = 0; idx < adjacent_tile_coords.length; idx++) {
    const adjacent_tile_coord = adjacent_tile_coords[idx];
    const adjacent_row = adjacent_tile_coord[0];
    const adjacent_cell = adjacent_tile_coord[1];
    const adjacent_tile = tiles[adjacent_row][adjacent_cell];
    const val = adjacent_tile[0];
    const is_revealed = adjacent_tile[1];

    // @note recurse if we find an adjacent tile with 0 value;
    if (val == 0 && !is_revealed) {
      tiles[adjacent_row][adjacent_cell] = [val, 1];
      const next_adjacent_tile_coords = get_adjacent_tile_coords(
        adjacent_row,
        adjacent_cell,
        adjacent_coord_positions,
        tiles.length - 1
      );
      walk_adjacent_tiles(
        adjacent_row,
        adjacent_cell,
        next_adjacent_tile_coords,
        tiles
      );
    } else if (is_revealed) {
      continue;
    } else {
      tiles[adjacent_row][adjacent_cell] = [val, 1];
    }
  }
}

// @note randomly generate the tiles.  Max is the max number of rows and cells.
// we currentlly lock the rows and cells so the board is always a square.
function generate_board_tiles(max, bomb_count) {
  const total_tiles = max * max;
  let tile_count = 0;
  const bomb_position = new Set();
  const bomb_coord = [];
  const next_board_tiles = [];

  // generate bomb positions
  for (let i = 0; i < bomb_count; i++) {
    bomb_position.add(getRandomInt(total_tiles));
  }

  // initialize board tiles and only add bombs
  for (let i = 0; i < max; i++) {
    let row = [];

    for (let j = 0; j < max; j++) {
      if (bomb_position.has(tile_count)) {
        bomb_coord.push([i, j]);
        row.push([-1, 0]);
      } else {
        row.push([0, 0]);
      }
      tile_count++;
    }

    next_board_tiles.push(row);
  }

  // update tiles with bombs nearby
  for (let i = 0; i < bomb_coord.length; i++) {
    const tile_row = bomb_coord[i][0];
    const tile_cell = bomb_coord[i][1];
    const adjacent_tile_coords = get_adjacent_tile_coords(
      tile_row,
      tile_cell,
      adjacent_coord_positions,
      next_board_tiles.length - 1
    );

    // inc each tile val adjacent to a bomb
    for (let idx = 0; idx < adjacent_tile_coords.length; idx++) {
      const adjacent_tile_coord = adjacent_tile_coords[idx];
      const adjacent_row = adjacent_tile_coord[0];
      const adjacent_cell = adjacent_tile_coord[1];
      const adjacent_tile = next_board_tiles[adjacent_row][adjacent_cell];

      // don't increment if it's already a bomb
      if (adjacent_tile[0] > -1) {
        adjacent_tile[0]++;
      }
    }
  }

  return next_board_tiles;
}

function update_tiles(tile_coords, tiles) {
  const tile_row = tile_coords[0];
  const tile_cell = tile_coords[1];
  const tile = tiles[tile_coords[0]][tile_coords[1]];
  const val = tile[0];
  const is_revealed = tile[1];

  // reveal bomb.  Game over.
  if (val == -1) {
    tiles[tile_row][tile_cell] = [val, 1];
    return;
  }

  // skip when the tile is already revealed
  if (is_revealed) {
    return;
  }

  // reveal current tile
  if (val > 0) {
    tiles[tile_row][tile_cell] = [val, 1];
    return tiles[tile_row][tile_cell];
  }

  // reveal adjacent tiles
  if (val == 0) {
    // reveal tile
    tiles[tile_row][tile_cell] = [val, 1];

    // reveal adjacent tiles
    const adjacent_tiles = get_adjacent_tile_coords(
      tile_row,
      tile_cell,
      adjacent_coord_positions,
      tiles.length - 1
    );

    walk_adjacent_tiles(tile_row, tile_cell, adjacent_tiles, tiles);

    return tiles[tile_row][tile_cell];
  }
}

// DOM Helpers
// ---------------------------------------------------------------------------

function clearChildren(el) {
  let child_el = el.lastElementChild;
  while (child_el) {
    el.removeChild(child_el);
    child_el = el.lastElementChild;
  }
}

function toggle_modal() {
  const modal_el = document.getElementById("root-modal");

  if (modal_el.classList.contains("modal:open")) {
    modal_el.classList.remove("modal:open");
  } else {
    modal_el.classList.add("modal:open");
  }
}

function create_tile_row_el() {
  const tile_row_el = document.createElement("div");
  tile_row_el.classList.add("row");
  return tile_row_el;
}

function create_tile_el(tile, tile_coords) {
  const val = tile[0];
  const is_revealed = tile[1];

  // create tile element
  const tile_el = document.createElement("div");
  tile_el.innerHTML = "0";
  tile_el.classList.add("center-content", "tile");
  tile_el.dataset.tile = `${tile_coords[0]},${tile_coords[1]}`;

  // reveal number tile
  if ((val >= 1 && is_revealed) || (val == 0 && is_revealed)) {
    tile_el.innerHTML = val;
    tile_el.classList.add("tile:open");
  }

  // reveal bomb tile
  if (val == -1 && is_revealed) {
    game_over = true;
    tile_el.innerHTML = val;
    tile_el.classList.add("tile:open");
    tile_el.classList.add("tile:bomb");

    toggle_modal();
  }

  return tile_el;
}

// Rendering
// ----------------------------------------------------------------------------

function handle_tile_press(event, board_el, tiles) {
  if (game_over) {
    return;
  }

  if (event.target.classList.contains("tile")) {
    const tile_coords = event.target.dataset.tile
      .split(",")
      .map((coord) => parseInt(coord));

    update_tiles(tile_coords, tiles);

    draw_board(board_el, tiles);
  }
}

function handle_reset_game(event, board_el, tiles) {
  board_tiles = generate_board_tiles(game_size, number_of_bombs);

  draw_board(board_el, tiles);

  toggle_modal();

  game_over = false;
}

function add_event_listeners(board_el) {
  board_el.addEventListener("click", (event) =>
    handle_tile_press(event, board_el, board_tiles)
  );

  document
    .getElementById("reset-game")
    .addEventListener("click", (event) =>
      handle_reset_game(event, board_el, board_tiles)
    );
}

function draw_board(board_el, tiles) {
  // clear board
  if (board_el.children.length > 0) {
    clearChildren(board_el);
  }

  // draw board
  for (let tile_row_idx = 0; tile_row_idx < tiles.length; tile_row_idx++) {
    // draw row
    const tile_row_el = create_tile_row_el();
    board_el.append(tile_row_el);

    // draw tiles in row
    for (
      let tile_cell_idx = 0;
      tile_cell_idx < tiles[tile_row_idx].length;
      tile_cell_idx++
    ) {
      let tile = board_tiles[tile_row_idx][tile_cell_idx];
      let tile_coords = [tile_row_idx, tile_cell_idx];
      tile_row_el.append(create_tile_el(tile, tile_coords));
    }
  }
}

function run_game() {
  board_tiles = generate_board_tiles(game_size, number_of_bombs);

  const board_el = document.getElementById("root");

  draw_board(board_el, board_tiles);

  add_event_listeners(board_el);
}

run_game();
