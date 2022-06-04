const { execSync  } = require("child_process");
const chalk = require("chalk");
const folderPath = require("./constants")

const download = (url, name, folderName) => {
  const {blueBright, green, gray} = chalk; 

  console.log(blueBright(`\nDownloading ${green(name)} to ${green(folderPath + '/' + folderName + '/' + name)} from ${gray(url)}`));

  execSync(
    `cd ${folderPath} && curl -o '${folderName}'/'${name}' --create-dirs ${url} && powershell.exe "New-BurntToastNotification -Text '${name} has finished downloading' "`, 
    {stdio: 'inherit'}
  );
};

module.exports = download;
