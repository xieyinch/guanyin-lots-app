const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const MODULE_SRC = path.join(__dirname, "dynamic-colors-src");
const PACKAGE_NAME = "GlassDynamicColorsPackage";
const PACKAGE = "space.glass.divination";

function kotlinDir(platformProjectRoot) {
  return path.join(
    platformProjectRoot,
    "app",
    "src",
    "main",
    "java",
    ...PACKAGE.split(".")
  );
}

/**
 * Copies the two Kotlin files into the generated android project's source tree.
 */
function copyKotlinFiles(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const destDir = kotlinDir(config.modRequest.platformProjectRoot);
      fs.mkdirSync(destDir, { recursive: true });
      for (const file of fs.readdirSync(MODULE_SRC)) {
        if (file.endsWith(".kt")) {
          fs.copyFileSync(path.join(MODULE_SRC, file), path.join(destDir, file));
        }
      }
      return config;
    },
  ]);
}

/**
 * Register the native module by editing Expo's generated MainApplication.kt
 * directly. This is robust across config-plugins versions because it edits
 * the generated file by string rather than relying on a config-plugin API.
 */
function injectIntoMainApplication(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const main = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "java",
        ...PACKAGE.split("."),
        "MainApplication.kt"
      );
      if (!fs.existsSync(main)) {
        // Couldn't find the expected generated file; skip gracefully.
        return config;
      }
      let contents = fs.readFileSync(main, "utf8");

      const importLine = `import ${PACKAGE}.${PACKAGE_NAME}`;
      if (!contents.includes(importLine)) {
        contents = contents.replace(/(package [^\n]+\n)/, (m) => m + "\n" + importLine);
      }

      // Register inside the autolinked packages list.
      const addLine = `add(${PACKAGE_NAME}())`;
      if (!contents.includes(addLine)) {
        contents = contents.replace(
          /(PackageList\(this\)\.packages\.apply\s*\{)/,
          (m, p1) => p1 + "\n                " + addLine
        );
      }

      fs.writeFileSync(main, contents);
      return config;
    },
  ]);
}

module.exports = function withDynamicColors(config) {
  config = copyKotlinFiles(config);
  config = injectIntoMainApplication(config);
  return config;
};