const fs = require('fs');
const  { generateMaze } = require('./index.js');
const { exit } = require('process');

const args = process.argv.slice(2);
// const subfolder = args[0] ? `${args[0]}/` : '';
// sort args
let subfolder = 'output';

let lastDoubled = true;
let width = 0;
let height = 0;
let iterations = 1;

let totalWH = 0;
let minWidth = 0;
let minHeight = 0;
let minWidthAndHeight = 4; // TESTING
subfolder = '41-50'; // TESTING
totalWH = 18; // TESTING
iterations = 10; // TESTING
for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
        const arg = args[i].slice(1);
        if (arg === 'h') {
            console.log('Usage: node levelBuilder.js [options]');
            console.log('Options:');
            console.log('  -h: show help');
            console.log('  -s: subfolder (default: output)');
            console.log('  -w: width');
            console.log('  -h: height');
            console.log('  -i: iterations');
            console.log('  -t: totalWH');
            console.log('  -mw: minWidth');
            console.log('  -mh: minHeight');
            console.log('  -mwh: minWidthAndHeight');
            console.log('  -d: lastDoubled');
            process.exit(0);
        }
        if (arg === 's') {
            subfolder = args[++i];
        }
        // SINGLE ITERATION
        if (arg === 'w') {
            width = parseInt(args[++i]);
        }
        if (arg === 'h') {
            height = parseInt(args[++i]);
        }
        // MULTIPLE ITERATIONS
        if (arg === 'i') {
            iterations = parseInt(args[++i]);
        }
        if (arg === 't') {
            totalWH = parseInt(args[++i]);
        }
        if (arg === 'mw') {
            minWidth = parseInt(args[++i]);
        }
        if (arg === 'mh') {
            minHeight = parseInt(args[++i]);
        }
        if (arg === 'mwh') {
            minWidthAndHeight = parseInt(args[++i]);
        }
        if (arg === 'd') {
            lastDoubled = true;
        }
        else {
            console.log(`Unknown argument: ${arg}`);
            process.exit(1);
        }
    }
}
if (minWidth < minWidthAndHeight) minWidth = minWidthAndHeight;
if (minHeight < minWidthAndHeight) minHeight = minWidthAndHeight;
if (totalWH === 0 && width === 0) { width = 10; } // DEFAULT
if (totalWH === 0 && height === 0) { height = 10; } // DEFAULT

async function generateMazeAndSave(w, h, save = true) {
    try {
        const maze = await generateMaze(w, h);
        console.log(`maze generated in: ${maze.timeElapsed}ms`)
    
        const destPath = `buildLevels/${subfolder}/${maze.fileName}`;
    
        // await 100 ms to prevent overwriting
        await new Promise(resolve => setTimeout(resolve, 100));
    
        if (!save) return;

        // create folder if it doesn't exist
        const folderPath = destPath.slice(0, destPath.lastIndexOf('/'));
        if (!fs.existsSync(folderPath)) { fs.mkdirSync(folderPath, { recursive: true }); }
        
        // write files
        fs.writeFileSync(`${destPath}.png`, maze.pngBuffer);
        fs.writeFileSync(`${destPath}.svg`, maze.svgString);
        return maze.fileName;
    } catch (error) {
        // console.log(`generateMazeAndSave... Trying again...`);
        if (error.message === "Cannot read properties of undefined (reading 'metadata')") {
            console.log(`generateMazeAndSave... Trying again...`);
        } else {
            console.log(`generateMazeAndSave -> error: ${error}`);
        }
        return false;
    }
}
async function main() {
    const startTime = Date.now();

    let successiveFailures = 0;
    let mazeWHList = [];
    for (let i = 0; i < iterations; i++) {
        let totalWH_ = totalWH;
        if (i === iterations - 1) {
            totalWH_ = totalWH ? totalWH * 2 : totalWH;
        }

        let w = 0;
        let h = 0;

        // GENERATE RANDOM RESPECTING CONDITIONS
        function fail(errorString) {
            if (errorString) { console.log(errorString); }
            successiveFailures++;
            return false;
        }

        let respectConditions = true;
        if (successiveFailures > 10000) { console.log(`10000 successive failures. Exiting...`); process.exit(1); }

        if (width > 0) w = width;
        if (height > 0) h = height;

        if (w > 0 && h > 0) {

            // IF WIDTH AND HEIGHT ARE DEFINED
            mazeWHList.push([w, h]);
        } else if (w > 0) {

            // IF ONLY WIDTH IS DEFINED
            if (totalWH_ === 0) { console.log('Error: totalWH need to be defined'); process.exit(1); }
            h = Math.floor(Math.random() * (totalWH_ - w)) + w;
            if (w + h !== totalWH_) { success = fail('Error: w+h !== totalWH'); }
            if (h < minHeight) { success = fail('Error: h < minHeight'); }
        } else if (h > 0) {

            // IF ONLY HEIGHT IS DEFINED
            if (totalWH_ === 0) { console.log('Error: totalWH need to be defined'); process.exit(1); }
            w = Math.floor(Math.random() * (totalWH_ - h)) + h;
            if (w + h !== totalWH_) { success = fail('Error: w+h !== totalWH'); }
            if (w < minWidth) { success = fail('Error: w < minWidth'); }
        } else {
            // CASE : NEITHER WIDTH NOR HEIGHT ARE DEFINED
            // BRUTEFORCE RANDOM WIDTH AND HEIGHT THAT RESPECT TOTALWH && MINWIDTH && MINHEIGHT
            w = Math.floor(Math.random() * totalWH_);
            h = totalWH_ - w;

            if (w + h !== totalWH_) { respectConditions = fail('Error: w+h !== totalWH'); }
            if (w < minWidth) { respectConditions = fail('Error: w < minWidth'); }
            if (h < minHeight) { respectConditions = fail('Error: h < minHeight'); }
        }

        if (!respectConditions) { 
            i--;
            continue;
        }

        console.log(`w: ${w}, h: ${h}`)
        mazeWHList.push([w, h]);
    }

    console.log(``);
    console.log(`STARTING GENERATION`);
    console.log(``);

    // GENERATE MAZES
    successiveFailures = 0;
    let mazeNames = [];
    let success = false;
    for (let i = 0; i < iterations; i++) {
        while (!success) {
            if (successiveFailures > 100) { console.log(`100 successive failures. Exiting...`); process.exit(1); }
            const w = mazeWHList[i][0];
            const h = mazeWHList[i][1];
            const fileName = await generateMazeAndSave(w, h);
            success = fileName ? true : false;
            if (!success) { successiveFailures++; continue; }
            mazeNames.push(fileName);
            console.log(`maze ${i+1}/${iterations} generated. w: ${w}, h: ${h}`);
        }
        successiveFailures = 0;
        success = false;
    }

    // GENERATE JSON
    if (subfolder !== 'output') {
        let json = {};
        json.setName = subfolder;
        json.totalSize = totalWH;
        json.minWidth = minWidth;
        json.minHeight = minHeight;
        json.mazes = [];
        for (let i = 0; i < iterations; i++) {
            json.mazes.push({
                name: `Level ${i+1}`,
                fileName: mazeNames[i]
            });
        }
        fs.writeFileSync(`buildLevels/${subfolder}/levelData.json`, JSON.stringify(json));
    }

    const endTime = Date.now();
    const timeElapsed = endTime - startTime;
    console.log('Done in ' + timeElapsed + 'ms');
}
main();