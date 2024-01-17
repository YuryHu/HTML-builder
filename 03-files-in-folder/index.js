const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading the directory', err);
  } else {
    files.forEach((file) => {
      fs.stat(path.join(folderPath, file), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile()) {
          console.log(`${file.split('.').join(' - ')} - ${stats.size}b`);
        }
      });
    });
  }
});
