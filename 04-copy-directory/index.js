const { join } = require('node:path');

const fs = require('fs');
const { access, rm } = require('node:fs/promises');

async function copyDir(oldDirPath, newDirPath) {
  try {
    await access(newDirPath);
    try {
      await rm(newDirPath, { recursive: true });
    } catch (e) {
      console.error('Destination directory exists and canot be deleted', e);
      return;
    }
  } catch {}

  fs.mkdir(newDirPath, (err2) => {
    if (err2) {
      console.error('Error creating the directory', err2);
      return;
    }
  });

  fs.readdir(oldDirPath, (err, files) => {
    if (err) {
      console.error('Error reading the directory', err);
    } else {
      files.forEach((file) => {
        fs.copyFile(join(oldDirPath, file), join(newDirPath, file), (err) => {
          if (err) {
            console.error(`Error when copying file ${file}`, err);
          }
        });
      });
    }
  });
}
copyDir(join(__dirname, 'files'), join(__dirname, 'files-copy'));
