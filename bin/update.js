#!/usr/bin/env node

/* eslint-disable @typescript-eslint/explicit-function-return-type, no-console */

const pkgUp = require("pkg-up");
const { readJSON, writeJSON, copy, pathExists } = require("fs-extra");
const { dirname, join } = require("path");

let PACKAGE_PATH;
let ROOT;
let PACKAGE_MANAGER;

/** Returns path of host module's `package.json` path. */
async function init() {
  if (!PACKAGE_PATH) PACKAGE_PATH = await pkgUp({ cwd: process.env.CWD }); // process.env.INIT_CWD
  if (!PACKAGE_PATH) throw new Error(`Cannot find package.json file in ${process.env.CWD}`); // process.env.INIT_CWD
  ROOT = dirname(PACKAGE_PATH);
  if (!PACKAGE_MANAGER) PACKAGE_MANAGER = (await pathExists(join(ROOT, "package-lock.json"))) ? "npm" : "yarn";
}

/** Returns command tailored for host module's package manager: `yarn` or `npm`. */
function getPackageCommand(cmd) {
  return `${PACKAGE_MANAGER} ${cmd} ${PACKAGE_MANAGER === "npm" ? "--" : ""}`; // `npm command -- ` or `yarn command`
}

/**
 * Adds `scripts.lint` and `scripts.lint:report` to `package.json`.
 */
async function addScripts() {
  await init();
  const packageJson = await readJSON(PACKAGE_PATH);

  if (!packageJson.scripts) packageJson.scripts = {};
  packageJson.scripts.lint = `${getPackageCommand("lint:base")} 'src/**/*.+(js|jsx|ts|tsx|vue)'`;
  packageJson.scripts["lint:base"] = `eslint --cache --max-warnings 0`;
  packageJson.scripts.format = "prettier --check 'src/**/*.+(json|less|css|md|gql|graphql|html|yaml)' package.json";

  await writeJSON(PACKAGE_PATH, packageJson, { spaces: 2 });
}

/** Copies configuration files to host module. */
async function copyConfigs() {
  await init();
  await copy(join(__dirname, "../.editorconfig"), join(ROOT, ".editorconfig"), { overwrite: true });
  await copy(join(__dirname, "../.eslintignore"), join(ROOT, ".eslintignore"), { overwrite: true });
  await copy(join(__dirname, "../module-files/.eslintrc.js"), join(ROOT, ".eslintrc.js"), { overwrite: false });
}

async function update() {
  return Promise.all([addScripts(), copyConfigs()]);
}

update()
  .then(() => {
    console.log("ESLint configuration set.");
  })
  .catch((e) => {
    console.error("ESLint configuration cannot be set.");
    throw new Error(e);
  });
