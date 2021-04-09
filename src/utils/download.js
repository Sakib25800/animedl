const { execSync  } = require("child_process");
const chalk = require("chalk");
//  curl -o folder/file.png --create-dirs [URL] = command

const download = (url, name, folderName, folderPath = "/mnt/c/Users/sakib/downloads") => {
  console.log(chalk.blueBright(`\nDownloading ${chalk.green(name)} to ${chalk.green(folderPath+'/'+folderName+'/'+name)} from ${chalk.gray(url)}`));
  const command = `cd ${folderPath} && curl -o '${folderName}'/'${name}' --create-dirs ${url}`;
  execSync(command, {stdio: 'inherit'});
};

module.exports = download;
