const axios = require("axios");
const fs = require("fs");
const zip = require("cross-zip");
const path = require("path");

module.exports = {
  getExtensionsReleases: async (version: string) => {
    let filename: string;
    let downloadUrl: string;

    const response = await axios.get("https://api.github.com/repos/polkadot-js/extension/releases");

    if (version === "latest" || !version) {
      filename = response.data[0].assets[0].name;
      downloadUrl = response.data[0].assets[0].browser_download_url;
    } else if (version) {
      filename = `master-build.zip`;
      downloadUrl = `https://github.com/polkadot-js/extension/releases/download/v${version}/master-build.zip`;
    }

    return {
      filename,
      downloadUrl,
    };
  },

  download: async (url: string, destination: string) => {
    const writer = fs.createWriteStream(destination);
    const result = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
 
    await new Promise(resolve => result.data.pipe(writer).on("finish", resolve));
  },

  extract: async (file: string, destination: string) => {
    await zip.unzip(file, destination);
  },

  prepareExtension: async (version: string) => {
    const release = await module.exports.getExtensionsReleases(version);
    const downloadsDirectory = path.resolve(__dirname, "extensions");
    const polkadotDirectory = path.join(downloadsDirectory, "polkadot");

    if (fs.existsSync(polkadotDirectory)) {
      return polkadotDirectory;
    }
 
    if (!fs.existsSync(downloadsDirectory)) {
      fs.mkdirSync(downloadsDirectory, { recursive: true });
    }

    const downloadDestination = path.join(downloadsDirectory, release.filename);
    await module.exports.download(release.downloadUrl, downloadDestination);
    await module.exports.extract(downloadDestination, polkadotDirectory);

    return polkadotDirectory;
  },
};
