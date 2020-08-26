# Client (our Preact code)

This directory is where we store the source code for our client-side Preact apps.

We have multiple directories in here because our app creates menu items that open multiple dialog windows. Each dialog opens a separate app, so each directory here represents its own distinct Preact app. Our webpack configuration will generate a separate bundle for each Preact app.

## Requirements

Each Preact app will need:
- an entrypoint, usually a file named `index.js`, that loads the app
- an HTML file that acts as a template, in which the bundled Preact app is loaded

You'll need to declare the following in [webpack.config.js](../../webpack.config.js):
- **name**: just a name to print in the webpack console, e.g. 'CLIENT - Dialog'
- **entry**: the path to the entry point for the app, e.g. './src/client/dialog/index.js'
- **filename**: the name of the html file that is generated. The server code will reference this filename to load the app into a dialog window. E.g. 'dialog'
- **template**: the path to the HTML template for the app, e.g. './src/client/dialog/index.html'


### Adding or removing an entrypoint
Your app or use case may only require a single dialog or sidebar, or you may want to add more than are included in the sample app.

To edit the entrypoints, you will need to:

1. Create or remove the entrypoint directories in the client source code. For instance, you can remove `./src/client/sidebar` altogether, or copy it and modify the source code. See above [requirements](#requirements).

2. Modify the server-side code to load the correct menu items and expose the correct public functions:
    - [ui folder](../server/ui)
    - [index file](../server/index.js)

3. Modify the `clientEntrypoints` config in the [webpack config file](../../webpack.config.js).
