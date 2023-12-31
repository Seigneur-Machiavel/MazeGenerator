const
    SHAPE_SQUARE = 'square',
    SHAPE_TRIANGLE = 'triangle',
    SHAPE_HEXAGON = 'hexagon',
    SHAPE_CIRCLE = 'circle',

    ALGORITHM_NONE = 'none',
    ALGORITHM_BINARY_TREE = 'binaryTree',
    ALGORITHM_SIDEWINDER = 'sidewinder',
    ALGORITHM_ALDOUS_BRODER = 'aldousBroder',
    ALGORITHM_WILSON = 'wilson',
    ALGORITHM_HUNT_AND_KILL = 'huntAndKill',
    ALGORITHM_RECURSIVE_BACKTRACK = 'recursiveBacktrack',
    ALGORITHM_KRUSKAL = 'kruskal',
    ALGORITHM_SIMPLIFIED_PRIMS = 'simplifiedPrims',
    ALGORITHM_TRUE_PRIMS = 'truePrims',
    ALGORITHM_ELLERS = 'ellers',

    DIRECTION_NORTH = 'n',
    DIRECTION_SOUTH = 's',
    DIRECTION_EAST = 'e',
    DIRECTION_WEST = 'w',
    DIRECTION_NORTH_WEST = 'nw',
    DIRECTION_NORTH_EAST = 'ne',
    DIRECTION_SOUTH_WEST = 'sw',
    DIRECTION_SOUTH_EAST = 'se',
    DIRECTION_CLOCKWISE = 'cw',
    DIRECTION_ANTICLOCKWISE = 'acw',
    DIRECTION_INWARDS = 'in',
    DIRECTION_OUTWARDS = 'out',

    EVENT_CLICK = 'click',
    EVENT_MOUSE_OVER = 'mouseOver',

    METADATA_VISITED = 'visited',
    METADATA_SET_ID = 'setId',
    METADATA_MAX_DISTANCE = 'maxDistance',
    METADATA_DISTANCE = 'distance',
    METADATA_PATH = 'path',
    METADATA_MASKED = 'masked',
    METADATA_CURRENT_CELL = 'current',
    METADATA_UNPROCESSED_CELL = 'unprocessed',
    METADATA_START_CELL = 'startCell',
    METADATA_END_CELL = 'endCell',
    METADATA_COST = 'cost',
    METADATA_PLAYER_CURRENT = 'playerCurrent',
    METADATA_PLAYER_VISITED = 'playerVisited',
    METADATA_RAW_COORDS = 'rawCoords',

    EXITS_NONE = 'no exits',
    EXITS_HARDEST = 'hardest',
    EXITS_HORIZONTAL = 'horizontal',
    EXITS_VERTICAL = 'vertical',

    PATH_COLOUR = '#006BB7',
    CELL_BACKGROUND_COLOUR = 'white',
    CELL_MASKED_COLOUR = 'grey',
    CELL_UNPROCESSED_CELL_COLOUR = '#bbb',
    CELL_PLAYER_CURRENT_COLOUR = PATH_COLOUR,
    CELL_PLAYER_VISITED_COLOUR = PATH_COLOUR + '44',
    CELL_CURRENT_CELL_COLOUR = PATH_COLOUR,
    WALL_COLOUR = 'black';

module.exports = {
    SHAPE_SQUARE, SHAPE_TRIANGLE, SHAPE_HEXAGON, SHAPE_CIRCLE,
    ALGORITHM_NONE, ALGORITHM_BINARY_TREE, ALGORITHM_SIDEWINDER, ALGORITHM_ALDOUS_BRODER, ALGORITHM_WILSON, ALGORITHM_HUNT_AND_KILL, ALGORITHM_RECURSIVE_BACKTRACK, ALGORITHM_KRUSKAL, ALGORITHM_SIMPLIFIED_PRIMS, ALGORITHM_TRUE_PRIMS, ALGORITHM_ELLERS,
    DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_EAST, DIRECTION_WEST, DIRECTION_NORTH_WEST, DIRECTION_NORTH_EAST, DIRECTION_SOUTH_WEST, DIRECTION_SOUTH_EAST, DIRECTION_CLOCKWISE, DIRECTION_ANTICLOCKWISE, DIRECTION_INWARDS, DIRECTION_OUTWARDS,
    EVENT_CLICK, EVENT_MOUSE_OVER,
    METADATA_VISITED, METADATA_SET_ID, METADATA_MAX_DISTANCE, METADATA_DISTANCE, METADATA_PATH, METADATA_MASKED, METADATA_CURRENT_CELL, METADATA_UNPROCESSED_CELL, METADATA_START_CELL, METADATA_END_CELL, METADATA_COST, METADATA_PLAYER_CURRENT, METADATA_PLAYER_VISITED, METADATA_RAW_COORDS,
    EXITS_NONE, EXITS_HARDEST, EXITS_HORIZONTAL, EXITS_VERTICAL,
    PATH_COLOUR, CELL_BACKGROUND_COLOUR, CELL_MASKED_COLOUR, CELL_UNPROCESSED_CELL_COLOUR, CELL_PLAYER_CURRENT_COLOUR, CELL_PLAYER_VISITED_COLOUR, CELL_CURRENT_CELL_COLOUR, WALL_COLOUR
};