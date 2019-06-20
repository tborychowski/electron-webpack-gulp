const {app, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');
// const updater = require('./app/updater/main');
const contextMenu = require('electron-context-menu');

let win;


contextMenu();
// const send = (name, val) => win.webContents.send(name, val);

function createWindow () {
	const mainWindowState = windowStateKeeper({ defaultWidth: 400, defaultHeight: 800 });

	win = new BrowserWindow({
		title: 'App Name',
		icon: __dirname + '/assets/icon.png',
		vibrancy: 'dark',
		titleBarStyle: 'hiddenInset',
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		show: false,
		webPreferences: {
			nodeIntegration: true,
		}
	});
	win.on('ready-to-show', () => win.show());
	win.on('closed', () => win = undefined);
	win.webContents.on('crashed', () => { win.destroy(); createWindow(); });
	mainWindowState.manage(win);

	win.loadFile('index.html');

	// win.webContents.openDevTools();

	// updater.init(win);
}

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) app.quit();


app.on('second-instance', () => {
	if (win) {
		if (win.isMinimized()) win.restore();
		win.show();
	}
});

app.on('window-all-closed', app.quit);
app.on('ready', createWindow);
