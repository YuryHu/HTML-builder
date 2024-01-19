const {
  readFile,
  access,
  rm,
  mkdir,
  appendFile,
  readdir,
  copyFile,
  stat,
} = require('node:fs/promises');
const { join, extname } = require('path');

async function buildProject() {
  const projectFolder = join(__dirname, 'project-dist');
  await removeFolderIfExists(projectFolder);
  await mkdir(projectFolder);
  const indexContent = await getIndexContent();
  await appendFile(join(projectFolder, 'index.html'), indexContent);
  await compile(join(__dirname, 'styles'), join(projectFolder, 'style.css'));
  copyDir(join(__dirname, 'assets'), join(projectFolder, 'assets'));
}

async function getIndexContent() {
  try {
    const data = await readFile(join(__dirname, 'template.html'), {
      encoding: 'utf8',
    });
    const templateTags = getTemplateTags(data);
    const replacers = await getReplacers(templateTags);
    return data.replace(/\{\{([^{}]+)\}\}/g, (match, content) => {
      return replacers.get(content);
    });
  } catch (err) {
    console.log(err);
  }
}

function getTemplateTags(str) {
  const templateTags = str.match(/\{\{([^{}]+)\}\}/g);
  //select unique only
  const uniqueTags = new Set(templateTags);
  //remove braces
  return [...uniqueTags].map((el) => el.slice(2, el.length - 2));
}

async function getReplacers(names) {
  const replacers = new Map();
  for (const name of names) {
    try {
      const data = await readFile(
        join(__dirname, 'components', `${name}.html`),
        {
          encoding: 'utf8',
        },
      );
      replacers.set(name, data);
    } catch (err) {
      console.error(err.message);
    }
  }
  return replacers;
}
async function removeFolderIfExists(path) {
  try {
    await access(path);
    try {
      await rm(path, { recursive: true });
    } catch (e) {
      console.error('Destination directory exists and canot be deleted', e);
      return;
    }
  } catch {
    console.log('');
  }
}

async function compile(folder, bundleFile) {
  try {
    const files = await readdir(folder);
    for (const file of files) {
      if (extname(file) === '.css') {
        try {
          const data = await readFile(join(folder, file), {
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

async function copyDir(oldDirPath, newDirPath) {
  await mkdir(newDirPath);
  const files = await readdir(oldDirPath);
  for (const file of files) {
    const stats = await stat(join(oldDirPath, file));
    if (stats.isFile()) {
      await copyFile(join(oldDirPath, file), join(newDirPath, file));
    } else {
      await copyDir(join(oldDirPath, file), join(newDirPath, file));
    }
  }
}

buildProject();
