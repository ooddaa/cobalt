const esbuild = require("esbuild");
const { sassPlugin, postcssModules } = require("esbuild-sass-plugin")
const { appendFileSync, writeFileSync, readdirSync } = require('node:fs');
const path = require("path")

// finds all .scss files in ../../lib/cobalt_web/live/
// and appends its paths as static imports to app.js
// so that styles are available to the client
// and we can reference them in .html.heex templates
//
// I have a nasty feeling that all this is done by 
// esbuild, but couldn't find a working solution yet
const lib = "../lib/cobalt_web/live"
const pathname = path.resolve(__dirname, lib)
const files = readdirSync(pathname, {withFileTypes: true, recursive: true})

// TODO: possibly this file can be created by Elixir build script?
const styles = path.resolve(__dirname, "./scss/styles.js")

// empty file contents
writeFileSync(styles, ``);

// append imports
files.forEach(async ({parentPath, name}) => {
  try {
    if (name.endsWith(".scss")) 
      appendFileSync(styles, `import "${path.join(parentPath, name)}";\n`);
  } catch (err) {
    /* Handle the error */
  } 
})

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const deploy = args.includes('--deploy');

const loader = {};

const plugins = [
  sassPlugin({
    filter: /\.module\.scss$/,
    transform: postcssModules({
      localsConvention: 'camelCaseOnly',
      getJSON: function(cssFilename, json, outputFileName) {
        // classnames are locally scoped so a user-friendly camelCased classnames
        // aliases are saved into module_name.styles.json file 
        // so they can be used in .html.heex templates
        const jsonName = path.basename(cssFilename, ".module.scss") + ".styles.json"
        const jsonPathname = path.resolve(path.dirname(cssFilename), jsonName)
        writeFileSync(jsonPathname, JSON.stringify(json))
      }
    })
  })
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
