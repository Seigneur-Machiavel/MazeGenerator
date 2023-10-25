//const fs = require('fs');
const { createCanvas } = require('canvas');
const {buildModel} = require('./js/model.js');
const { buildMaze } = require('./js/lib/main.js');
const { drawingSurfaces } = require('./js/lib/drawingSurfaces.js');
const {buildRandom} = require('./js/lib/random.js');

function getModelMaskKey(model) {
    if (model.shape && model.size) {
        return `${model.shape}-${Object.values(model.size).join('-')}`;
    }
}
function buildMazeUsingModel(model, canvas) {
    if (model.maze) {
        model.maze.dispose();
    }

    const grid = Object.assign({'cellShape': model.shape}, model.size),
        maze = buildMaze({
            grid,
            'algorithm': model.algorithm,
            'randomSeed' : model.randomSeed,
            'element': canvas,
            'mask': model.mask[getModelMaskKey(model)],
            'exitConfig': model.exitConfig
        });

    model.maze = maze;

    const algorithmDelay = model.algorithmDelay,
        runAlgorithm = maze.runAlgorithm;
    if (algorithmDelay) {
        model.runningAlgorithm = {run: runAlgorithm};
        return new Promise(resolve => {
            stateMachine.runningAlgorithm();
            model.runningAlgorithm.interval = setInterval(() => {
                const done = runAlgorithm.oneStep();
                maze.render();
                if (done) {
                    clearInterval(model.runningAlgorithm.interval);
                    delete model.runningAlgorithm;
                    stateMachine.displaying();
                    resolve();
                }
            }, algorithmDelay/maze.cellCount);
        });

    } else {
        runAlgorithm.toCompletion();
        maze.render();
        return Promise.resolve();
    }

}
async function generateMaze(width = 10, height = 10, SIZE = 500, seed = null) {
    const { createSVGWindow } = await import('svgdom');
    const window = createSVGWindow();
    const SVG = require('svg.js')(window);

    const model = buildModel()
    model.size = {width, height};
    model.algorithm = 'recursiveBacktrack';
    model.randomSeed = seed || Number(buildRandom().int(Math.pow(10,9)));

    const startTime = Date.now();

    const virtualCanvas = createCanvas(SIZE, SIZE);
    virtualCanvas.tagName = 'canvas';

    await buildMazeUsingModel(model, virtualCanvas);

    // CREATE PNG
    const pngBuffer = virtualCanvas.toBuffer('image/png');

    // CREATE SVG
    const SVG_SIZE = 500;
    const svg = SVG(window.document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    svg.node.setAttribute('width', SVG_SIZE);
    svg.node.setAttribute('height', SVG_SIZE);

    const svgDrawingSurface = drawingSurfaces.svg({el: svg, window, SVG})
    model.maze.render(svgDrawingSurface);
    const svgString = svg.svg();
    
    const fileName = `maze_${model.shape}_${Object.values(model.size).join('_')}_${model.randomSeed}`;
    const timeElapsed = Date.now() - startTime;
    // console.log(`maze generated in ${timeElapsed}ms`);

    return {
        pngBuffer,
        svgString,
        fileName,
        timeElapsed
    };
}

// generateMaze();

module.exports = {
    generateMaze
}