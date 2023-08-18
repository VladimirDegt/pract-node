const fs = require("fs/promises");
const path = require("path");
const dataValidate = require("./helpers/dataValidator");
const checkExtention = require("./helpers/checkExtention");

const createFile = async (req, res) => {
  const { fileName, content } = req.body;

  const validate = dataValidate(req.body);

  if (validate.error) {
    res.status(400).json({
      message: `Please, specify ${validate.error.details[0].context.label} params`
    });
    return;
  }

  const includes = checkExtention(fileName);

  if (!includes.result) {
    res.status(400).json({message: `Sorry, this aplication does not support ${includes.fileExtension} extentions`});
    return;
  }

  try {
    const filePath = path.join(__dirname, "files", fileName);
    await fs.writeFile(filePath, content, "utf-8");
    res.status(201).json({message: `The file "${fileName}" was created`});
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getFiles = async (req, res) => {
  try {
    const dirPath = path.join(__dirname, "files");
    const data = await fs.readdir(dirPath);
    if (data.length === 0) {
      res.status(404).json({ message: "No files in this folder" });
      return;
    }
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getInfo = async (req, res) => {
  const { fileName } = req.params;
  try {
    const data = await fs.readdir(path.join(__dirname, "files"));
    const findFile = data.includes(fileName);
    if (!findFile) {
      res.status(404).json({ message: `No file ${fileName} in this folder!` });
    } else {
      const pathFile = path.join(__dirname, "files", fileName);
      const contentFile = await fs.readFile(pathFile, "utf-8");
      const stats = await fs.stat(pathFile);
      const fileInfo = {
        content: contentFile,
        extention: path.extname(fileName).slice(1),
        name: path.basename(pathFile, path.extname(fileName)),
        createAt: stats.birthtime.toString(),
        Size: stats.size,
      };
      res.json(fileInfo)
      return;
    }
  } catch (error) {
    console.log('error.message', error.message)
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createFile,
  getFiles,
  getInfo,
};
