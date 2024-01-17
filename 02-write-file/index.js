const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const finish = () => {
  console.log('\nGood luck!');
  output.end();
  process.exit();
};
stdout.write('Enter the text:\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().slice(0, 4) === 'exit') {
    finish();
  } else {
    output.write(chunk);
  }
});
process.on('SIGINT', finish);
