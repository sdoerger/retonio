import { clear } from 'console';
import fs from 'fs';

import promptSync from 'prompt-sync';
const prompt = promptSync();

const fileType = process.argv[2] || 'js';
const packageCall = process.argv[3] || false;
const baseDir = 'src/store/modules';

let storeName = process.argv[4] || false;
let storePath = process.argv[5] || '';

clear;

function createDirPath(dirPath) {
  if (dirPath) {
    return `${baseDir}/${dirPath}`;
  }
}

function createContent() {
  return `// LIBS
  import { defineStore } from 'pinia';
  import { retonio } from 'retonio';
  
  // API
  import { /*API CALl*/ } from '@/api/';
  
  const config = {
    pinia: defineStore,
  };
  
  // ----------
  // RETONIO
  // ----------
  export const use${storeName}Store = retonio('${storeName}', /*API CALl*/, config);`;
}

function createFile(path) {
  // ONLY if file does not exisit
  fs.writeFile(`${path}/${storeName}.${fileType}`, createContent(), { flag: 'wx' }, function (err) {
    if (err) {
      console.log('Error');
      return console.log(`File ${storeName} already exists!`);
    }
    return console.log(`File ${storeName} was created.`);
  });
}

function create() {
  const path = createDirPath(storePath);
  console.log('path');
  console.log(path);

  // IF directory exists
  if (path && fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    createFile(path);
  } else {
    console.log('IS NO DIR');

    // ELSE IF path is provided
    // Create dir
    if (storePath) {
      fs.mkdir(`${baseDir}/${storePath}`, function (err) {
        if (err) {
          console.log('Error');
          return console.log(`Dir ${storePath} already exists!`);
        }
        return console.log(`Dir ${storePath} was created.`);
      });
      createFile(path);
    } else {
      // OR STORE AT modules
      createFile(baseDir);
    }
  }
}

if (packageCall == 'true') {
  console.log('Enter store name:');
  storeName = prompt();
  console.log(`${storeName}`);
  console.log('enter folder name:');
  storePath = prompt();
  console.log(`${storePath}`);
  createDirPath(storePath);
  create();
} else {
  if (storeName) {
    // IF store path is provided via param
    create();
  }
}
