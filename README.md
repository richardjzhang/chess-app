# DEPRECATED
This chess app is out of date and currently in the process of being reworked

# Chess App
This project runs a simple chess application run using a minmax alpha-beta pruning algorithm.

## To start the project
Install all packages by running:
```
yarn install
```

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Create a `.env` file
Add the following line to the `.env` file: `NODE_PATH=./src`

## Where is it hosted
Currently hosted on Heroku, where auto deploys occur whenever the `production` branch of this repo is updated.

## Anything else I should know?
The website is pinged every 30 minutes using a Google Apps Script fetch function to prevent the website from going to sleep.

### Libraries used for chess app
[chess.js](https://github.com/jhlywa/chess.js/blob/master/README.md)

[chessboardjsx](https://github.com/willb335/chessboardjsx)
