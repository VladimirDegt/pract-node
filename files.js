const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");
const dataValidate = require("./helpers/dataValidator");
const checkExtention = require("./helpers/checkExtention");

const createFile = async (fileName, content) => {
  const file = {
    fileName,
    content,
  };

  const validate = dataValidate(file);

  if (validate.error) {
    console.log(
      chalk.red(
        `Please, specify ${validate.error.details[0].context.label} params`
      )
    );
    return;
  }

  const includes = checkExtention(fileName);

  if (!includes.result) {
    console.log(
      chalk.red(
        `Sorry, this aplication does not support ${includes.fileExtension} extentions`
      )
    );
    return;
  }

  try {
    const filePath = path.join(__dirname, "files", fileName);
    await fs.writeFile(filePath, content, "utf-8");
  } catch (error) {
    console.log(error.message);
  }
};

const getFiles = async () => {
  try {
    const dirPath = path.join(__dirname, "files");
    const data = await fs.readdir(dirPath);
    if (data.length === 0) {
      console.log(chalk.red("No files on this folder"));
      return;
    }
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};

const getInfo = async (fileName) => {
  try {
    const data = await fs.readdir(path.join(__dirname, "files"));
    const findFile = data.includes(fileName);
    if (!findFile) {
      console.log(chalk.red(`No file ${fileName} on this folder!`));
    } else {
      const pathFile = path.join(__dirname, "files", fileName);
      const contentFile = await fs.readFile(pathFile, "utf-8");
      const stats = await fs.stat(fileName);
      const fileInfo = {
        content: contentFile,
        extention: path.extname(fileName).slice(1),
        name: path.basename(pathFile, path.extname(fileName)),
        createAt: stats.birthtime.toString(),
        Size: stats.size,
      };
      console.table(fileInfo);
      // console.log(stats);
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  createFile,
  getFiles,
  getInfo,
};
