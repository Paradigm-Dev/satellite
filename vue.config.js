module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      outputDir: "dist",
      removeElectronJunk: false,
      nodeIntegration: true,
      builderOptions: {
        productName: "ElectronTemplate",
        mac: {
          darkModeSupport: true,
        },
        dmg: {
          artifactName: "ElectronTemplate-v${version}.${ext}",
          title: "ElectronTemplate",
        },
        nsis: {
          artifactName: "ElectronTemplate-v${version}.${ext}",
          deleteAppDataOnUninstall: true,
          shortcutName: "ElectronTemplate",
          uninstallDisplayName: "ElectronTemplate",
        },
      },
    },
  },
};
