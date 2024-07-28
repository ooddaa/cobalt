const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin")
const { appendFileSync, writeFileSync } = require('node:fs');

// finds all .scss files in ../../lib/cobalt_web/live/
// and appends its paths as static imports to app.js
// so that styles are available to the client
// and we can reference them in .html.heex templates
// TODO: write .scss finder 
// I have a nasty feeling that all this is done by 
// esbuild, but couldn't find a working solution yet
const scssFiles = [
  "../../lib/cobalt_web/live/chat/chat.module.scss", 
  "../../lib/cobalt_web/live/main/main.module.scss", 
]

// TODO: possibly this file can be created by Elixir build?
const styles = "scss/styles.js"

// empty file contents
// TODO: create if doesn't exist 
writeFileSync(styles, ``);

// append imports
scssFiles.forEach(async (path) => {
  try {
    appendFileSync(styles, `import "${path}";\n`);
  } catch (err) {
    /* Handle the error */
  } 
})


const args = process.argv.slice(2);
const watch = args.includes('--watch');
const deploy = args.includes('--deploy');

const loader = {};

const plugins = [
  sassPlugin()
];

// Define esbuild options
let opts = {
  entryPoints: ["js/app.js"],
  bundle: true,
  logLevel: "info",
  target: "es2017",
  outdir: "../priv/static/assets",
  external: ["*.css", "fonts/*", "images/*"],
  nodePaths: ["../deps"],
  loader: loader,
  plugins: plugins,
}

if (deploy) {
  opts = {
    ...opts,
    minify: true,
  };
}

if (watch) {
  opts = {
    ...opts,
    sourcemap: "inline",
  };
  esbuild
    .context(opts)
    .then((ctx) => {
      ctx.watch();
    })
    .catch((_error) => {
      process.exit(1);
    });
} else {
  esbuild.build(opts)
}
