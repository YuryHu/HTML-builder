const path = require('path');

//const fs = require('fs');
const {
  access,
  rm,
  readdir,
  readFile,
  appendFile,
} = require('node:fs/promises');

async function compile(folder, bundleFile) {
  //check if bundle file exists & remove if yes
  try {
    await access(bundleFile);
    try {
      await rm(bundleFile);
    } catch (e) {
      console.error('Destination file exists and canot be rewritten', e);
      return;
    }
  } catch {
    console.log('');
  }
  //put content to bundlefile
  try {
    const files = await readdir(folder);
    for (const file of files) {
      if (path.extname(file) === '.css') {
        try {
          const data = await readFile(path.join(folder, file), {
            encoding: 'utf8',
          });
          try {
            await appendFile(bundleFile, '\n' + data);
          } catch (e) {
            console.error('Error appending to the destination file', e);
          }
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  } catch (err) {
    console.error('Error reading source directory', err);
  }
}
compile(
  path.join(__dirname, 'styles'),
  path.join(__dirname, 'project-dist', 'bundle.css'),
);
