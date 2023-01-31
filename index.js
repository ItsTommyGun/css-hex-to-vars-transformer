const fs = require('fs');
const chalk = require('chalk');
const { open } = require('node:fs/promises');

const runCommand = () => {
  // check for node args
  const filePath = process.argv.slice(2);
  const FILE_TO_CHECK = filePath[0];
  
  if(!FILE_TO_CHECK) {
    console.error(chalk.red.bold('✘ Please add the path to the css file.'));
    return;
  }
  
  if (!fs.existsSync(FILE_TO_CHECK)) {
    console.error(chalk.red.bold('✘ CSS file not found. Please check the path.'));
    return;
  }

  ConvertHexToVariables(FILE_TO_CHECK)
}

/**
 * @param {string} filePath the css file to be converted
 * @returns {void} transformed css files
 */
const ConvertHexToVariables = async (filePath) => {
  const file = await open(filePath);
  const regex = /#[0-9A-Fa-f]{6}/g;

  const foundHexCodes = []
  let cssFileWithVarSubstitutions = '';
  let exportedCSSVariables = ':root {'
  let variableIteration = 0

  for await (const line of file.readLines()) {
    if(!line.match(regex)) {
      cssFileWithVarSubstitutions += line + '\n';
    }
    if(line.match(regex)) {
      const foundHexCode = line.match(regex)[0];
      if(foundHexCodes.includes(foundHexCode)) {
        cssFileWithVarSubstitutions += line.replace(regex, `var(colorvariable-${foundHexCodes.indexOf(foundHexCode)})`) + '\n';
        continue;
      }

      foundHexCodes.push(foundHexCode);
      
      exportedCSSVariables += `\n  --colorvariable-${variableIteration}: ${line.match(regex)[0]};`;      
      cssFileWithVarSubstitutions += line.replace(regex, `var(colorvariable-${variableIteration})`);
      cssFileWithVarSubstitutions = appendLineBreakToString(cssFileWithVarSubstitutions);
    
      variableIteration++;
    }
  }

  // finish variables string
  exportedCSSVariables += '\n}';

  // create folder and files
  const folderName = './dist-vars';
  createFolder(folderName);

  const createdFilesPaths = [];
  createdFilesPaths.push(createCSSFileWithContent('styles', folderName, cssFileWithVarSubstitutions));
  createdFilesPaths.push(createCSSFileWithContent('variables', folderName, exportedCSSVariables));

  console.log("\x1b[42m", "Successfully substituted hex values with variables.", "\x1b[0m")
  console.log("\x1b[32m", `✓ Folder: ${folderName}`)
  createdFilesPaths.forEach(filePath => {
    console.log(`✓ File: ${filePath}`)
  });
}

function appendLineBreakToString(string) {
  return string + '\n';
}

function createFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * @returns string: file path including file name and extension
 */
function createCSSFileWithContent(fileName, filePath, content) {
  if(typeof content !== 'string') {
    console.error('content is not of type string!');
    return false;
  }

  fs.writeFile(`${filePath}/${fileName}.css`, content, err => {
    if (err) {
      console.error(err);
    }
  });

  return `${filePath}/${fileName}.css`;
}

module.exports = runCommand