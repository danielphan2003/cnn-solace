<!-- <p align="center">
  <a href="" rel="noopener">
 <img width="400" src="https://i.imgur.com/83Y7bWN.png" alt="CNN Solace Logos"></a>
</p> -->

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg?color=46963a&style=flat-square)]()
[![GitHub Issues](https://img.shields.io/github/issues/danielphan2003/cnn-solace.svg?color=lightblue&style=flat-square)](https://github.com/danielphan2003/cnn-solace/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/danielphan2003/cnn-solace.svg?color=blue&style=flat-square)](https://github.com/danielphan2003/cnn-solace/pulls)
[![License](https://img.shields.io/github/license/danielphan2003/cnn-solace?color=pink&style=flat-square)](/LICENSE)

</div>

<p align="center"> This is CNN Solace Utilities. It is used to manage Google Spreadsheets within the Red Flag team at Foreign Language Specialized School in Ha Noi, Vietnam.
</p>

---

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [🔎 About <a name = "about"></a>](#-about-)
- [🚜 Install <a name = "install"></a>](#-install-)
  - [Prerequisites <a name = "prerequisites"></a>](#prerequisites-)
  - [🏁 Getting started <a name = "getting-started"></a>](#-getting-started-)
- [🚀 Deploy <a name = "deploy"></a>](#-deploy-)
- [🎈 Local Development <a name="local-development"></a>](#-local-development-)
- [⛏️ Usage <a name = "Usage"></a>](#️-usage-)
  - [The included app](#the-included-app)
  - [Typescript](#typescript)
  - [Adding packages](#adding-packages)
  - [Styles](#styles)
  - [Modifying scopes](#modifying-scopes)
  - [Calling server-side Google Apps Script functions](#calling-server-side-google-apps-script-functions)
  - [Autocomplete](#autocomplete)
- [✍️ Authors <a name = "authors"></a>](#️-authors-)
- [🎉 Acknowledgements <a name = "acknowledgement"></a>](#-acknowledgements-)

<br/>

## 🔎 About <a name = "about"></a>

[Google Apps Script](https://developers.google.com/apps-script/overview) is Google's Javascript-based development platform for building applications and add-ons for Google Sheets, Docs, Forms and other Google Apps.

This repo uses [Preact](https://preactjs.com) and numerous [Node.js](https://nodejs.org) packages to reduce app size and to have better performance on old devices. IE browsers are not currently supported. Please use recent versions of modern web browsers for optimal experience. The current README file is adapted from the original project. More info in Acknowledgments section.

See below how to get started!

<br/>

## 🚜 Install <a name = "install"></a>

These instructions will get you set up with a copy of the Preact project code on your local machine. It will also get you logged in to `clasp` so you can manage script projects from the command line.

See [deploy](#deploy) for notes on how to deploy the project and see it live in a Google Spreadsheet.

### Prerequisites <a name = "prerequisites"></a>

- Make sure you're running at least [Node.js](https://nodejs.org/en/download/) v10 and `npm` v6.

- You'll need to enable the Google Apps Script API. You can do that by visiting [script.google.com/home/usersettings](https://script.google.com/home/usersettings).

- [New!] To use live reload while developing, you'll need to serve your files locally using HTTPS. See [local development](#local-development) below for how to set up your local environment.

### 🏁 Getting started <a name = "getting-started"></a>

**1.** First, let's clone the repo and install the dependencies.

```bash
git clone https://github.com/enuchi/Preact-Google-Apps-Script.git
cd Preact-Google-Apps-Script
npm install
```

<img width="100%" src="https://i.imgur.com/EGSsCqO.gif">

**2.** Next, we'll need to log in to [clasp](https://github.com/google/clasp), which lets us manage our Google Apps Script projects locally.

```bash
npm run login
```

<img width="100%" src="https://i.imgur.com/zKCgkMl.gif">

**3.** Now let's run the setup script to create a New spreadsheet and script project from the command line.

```bash
npm run setup
```

<img width="100%" src="https://imgur.com/Zk2eHFV.gif">

Alternatively, you can use an existing Google Spreadsheet and Script file instead of creating a new one.

<details>
  <summary>See instructions here for using an existing project.</summary>

1. Copy your existing script project's `scriptId`. You can find it by opening your spreadsheet, selecting **Tools > Script Editor** from the menubar, then **File > Project properties**.

2. Run the command below using your project's `scriptId`:

   ```bash
   npm run setup:use-id your_script_id_here
   ```

   This command will add the existing project's `scriptId` to your`.clasp.json` file. See [here](https://github.com/google/clasp#setting) for working with `clasp`.

<img width="100%" src="https://i.imgur.com/VYl3JHx.gif">

</details>

Next, let's deploy the app so we can see it live in Google Spreadsheets.

<br/>

## 🚀 Deploy <a name = "deploy"></a>

Run the deploy command. You may be prompted to update your manifest file. Type 'yes'.

```bash
npm run deploy
```

The deploy command will build all necessary files using production settings, including all server code (Google Apps Script code), client code (Preact bundle), and config files. All bundled files will be outputted to the `dist/` folder, then pushed to the Google Apps Script project.

Now open Google Sheets and navigate to your new spreadsheet (e.g. the file "My Preact Project"). Make sure to refresh the page if you already had it open. You will now see a new menu item appear containing your app!

<img width="100%" src="https://i.imgur.com/W7UkEpv.gif">

<br/>

## 🎈 Local Development <a name="local-development"></a>

We can develop our client-side Preact apps locally, and see our changes directly inside our Google Spreadsheet dialog window.

<img width="100%" src="https://i.imgur.com/EsnOEHP.gif">

There are two steps to getting started: installing a certificate (first time only), and running the start command.

1. Generating a certificate for local development <a name = "generatingcerts"></a>

    Install the mkcert package:

    ```bash
    # mac:
    $ brew install mkcert

    # windows:
    $ choco install mkcert
    ```

    [More install options here.](https://github.com/FiloSottile/mkcert#installation)

    Then run the mkcert install script:

    ```bash
    $ mkcert -install
    ```

    Create the certs in your repo:

    ```
    npm run setup:https
    ```

2. Now you're ready to start:
    ```bash
    npm run start
    ```

The start command will create and deploy a development build, and serve your local files.

<img width="100%" src="https://imgur.com/uD4uZZK.gif">

After running the start command, navigate to your spreadsheet and open one of the menu items. It should now be serving your local files. When you make and save changes to your Preact app, your app will reload instantly within the Google Spreadsheet, and have access to any server-side functions!

<img width="100%" src="https://i.imgur.com/EsnOEHP.gif">

<br/>

## ⛏️ Usage <a name = "Usage"></a>

### The included app

The included app allows altering sheets with school infos, such as class distribution, grades, and so on.

### Typescript

This project supports typescript!

To use, simply use a typescript extension in either the client code (.ts/.tsx) or the server code (.ts), and your typescript file will compile to the proper format.

For client-side code, see [FormInput.tsx in the Bootstrap demo](./src/client/dialog/components/FormInput.tsx) for an example file. Note that it is okay to have a mix of javascript and typescript, as seen in the Bootstrap demo.

To use typescript in server code, just change the file extension to .ts. The server-side code already utilizes type definitions for Google Apps Script APIs.

A basic typescript configuration is used here, because after code is transpiled from typescript to javascript it is once again transpiled to code that is compatible with Google Apps Script. However, if you want more control over your setup you can modify the included [tsconfig.json file](./tsconfig.json).

### Adding packages

You can add packages to your client-side Preact app.

For instance, install `react-transition-group` from npm:

```bash
npm install Preact-transition-group
```

Important: Since Google Apps Scripts projects don't let you easily reference external files, this project will bundle an entire app into one HTML file. This can result in large files if you are importing large packages. To help split up the files, you can grab a CDN url for your package and declare it in the [webpack file, here](./webpack.config.js#L129). If set up properly, this will add a script tag that will load packages from a CDN, reducing your bundle size.

### Styles

By default this project supports global CSS stylesheets. Make sure to import your stylesheet in your entrypoint file [index.js](./src/client/dialog/index.js):

```javascript
import './styles.css';
```

Many external component libraries require a css stylesheet in order to work properly. You can import stylesheets in the HTML template, [as shown here with the Bootstrap stylesheet](./src/client/dialog/index.html).

The webpack.config.js file can also be modified to support scss and other style libraries.

### Modifying scopes

The included app only requires access to Google Spreadsheets and to loading dialog windows. If you make changes to the app's requirements, for instance, if you modify this project to work with Google Forms or Docs, make sure to edit the oauthScopes in the [appscript.json file](./appsscript.json).

See https://developers.google.com/apps-script/manifest for information on the `appsscript.json` structure.

### Calling server-side Google Apps Script functions

This project uses the [gas-client](https://github.com/enuchi/gas-client) package to more easily call server-side functions using promises.

```js
// Google's documentation wants you to do this. Boo.
google.script.run
  .withSuccessHandler(response => doSomething(response))
  .withFailureHandler(err => handleError(err))
  .addSheet(sheetTitle);

// Poof! With a little magic we can now do this:
import Server from 'gas-client';
const { serverFunctions } = new Server();

// We now have access to all our server functions, which return promises!
serverFunctions
  .addSheet(sheetTitle)
  .then(response => doSomething(response))
  .catch(err => handleError(err));

// Or we can equally use async/await style:
async () => {
  try {
    const response = await serverFunctions.addSheet(sheetTitle);
    doSomething(response);
  } catch (err) {
    handleError(err);
  }
};
```

In development, `gas-client` will interact with [the custom Webpack Dev Server package](https://github.com/enuchi/Google-Apps-Script-Webpack-Dev-Server) which allows us to run our app within the dialog window and still interact with Google Apps Script functions.

### Autocomplete

This project includes support for autocompletion and complete type definitions for Google Apps Script methods.

![autocomplete support](https://i.imgur.com/E7FLeTX.gif 'autocomplete')

All available methods from the Google Apps Script API are shown with full definitions and links to the official documentation, plus information on argument, return type and sample code.

<br/>

## ✍️ Authors <a name = "authors"></a>

- [@danielphan2003](https://github.com/danielphan2003) - Maintainer

See the list of [contributors](https://github.com/danielphan2003/cnn-solace) who participated in the project.

<br/>

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- [@enuchi](https://github.com/enuchi) - Creator and maintainer of the [original app](https://github.com/enuchi/React-Google-Apps-Script)
  
Part of this project has been adapted from [apps-script-starter](https://github.com/labnol/apps-script-starter), a great starter project for server-side projects ([license here](https://github.com/labnol/apps-script-starter/blob/master/LICENSE)).
