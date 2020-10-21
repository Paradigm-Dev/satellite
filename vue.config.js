module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      outputDir: "dist",
      removeElectronJunk: false,
      nodeIntegration: true,
      builderOptions: {
        productName: "Satellite",
        mac: {
          darkModeSupport: true,
        },
        dmg: {
          artifactName: "Satellite-v${version}.${ext}",
          title: "Satellite",
        },
        nsis: {
          artifactName: "Satellite-v${version}.${ext}",
          deleteAppDataOnUninstall: true,
          shortcutName: "Satellite",
          uninstallDisplayName: "Satellite",
        },
      },
    },
  },
};
