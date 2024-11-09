module.exports = {
  packagerConfig: {
    icon: "src/assets/favicon.ico",
    asar: true,
    ignore: [
      "^/[.].+",
      "^/electron/tsconfig.json",
      "^/electron/src",
      "^/out",
      "^/src",
      "^/angular.json",
      "^/package-lock.json",
      "^/tsconfig.app.json",
      "^/tsconfig.json",
      "^/tsconfig.spec.json",
    ],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "handbrake-queue",
        title: "Handbrake Queue",
        setupIcon: "src/assets/icons/favicon.ico",
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
