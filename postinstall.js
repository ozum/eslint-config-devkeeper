#!/usr/bin/env node

/* eslint-disable @typescript-eslint/explicit-function-return-type, no-console */

const pkgUp = require("pkg-up");
const { readJSON, writeJSON, copy } = require("fs-extra");
const { dirname, join } = require("path");

let PACKAGE_PATH;

/** Returns path of host module's `package.json` path. */
async function getPackagePath() {
  if (!PACKAGE_PATH) PACKAGE_PATH = await pkgUp({ cwd: process.env.INIT_CWD });
  return PACKAGE_PATH;
}

/**
 * Adds `scripts.lint` and `scripts.lint:report` to `package.json`.
 */
async function addScripts() {
  const packagePath = await getPackagePath();
  if (!packagePath) throw new Error(`Cannot find package.json file in ${process.env.INIT_CWD}`);
  const packageJson = await readJSON(packagePath);

  if (!packageJson.scripts) packageJson.scripts = {};
  packageJson.scripts.lint = "eslint --cache --fix --max-warnings 0";
  packageJson.scripts["lint:report"] = `${packageJson.scripts.lint} --output-file eslint_report.json --format json `;

  await writeJSON(packagePath, packageJson, { spaces: 2 });
}

/** Copies configuration files to host module. */
async function copyConfigs() {
  const root = dirname(await getPackagePath());
  await copy(".editorconfig", join(root, ".editorconfig"), { overwrite: true });
  await copy(".eslintignore", join(root, ".eslintignore"), { overwrite: true });
  await copy("module-files/.eslintrc.js", join(root, ".eslintrc.js"), { overwrite: false });
}

async function postInstall() {
  return Promise.all([addScripts, copyConfigs]);
}

postInstall()
  .then(() => {
    console.log("ESLint configuration set.");
  })
  .catch((e) => {
    console.error("ESLint configuration cannot be set.");
    throw new Error(e);
  });
