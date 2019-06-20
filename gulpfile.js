const { series, parallel, src, dest, watch } = require('gulp');
const livereload = require('gulp-livereload');
const runElectron = require('gulp-run-electron');
const isProd = require('minimist')(process.argv.slice(2)).prod;


function webpackLogger (err) {
	const chalk = require('chalk');
	let time = new Date().toTimeString().substr(0,8);
	let message = 'Finished ' + chalk.green('webpack') + ' build';
	if (err) { message = chalk.red(err); time = chalk.red(time); }
	else time = chalk.grey(time);
	console.log(`[${time}] ${message}`); /* eslint no-console: 0 */
}


function eslint () {
	const gulpEslint = require('gulp-eslint');
	return src(['src/**/*.js'])
		.pipe(gulpEslint())
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.failAfterError());
}


function js () {
	const path = require('path');
	const webpack = require('webpack');
	const webpackStream = require('webpack-stream');
	const webpackConfig = {
		entry: { index: './src/index.js' },
		target: 'electron-main',
		output: {
			filename: 'index.js',
			path: path.join(__dirname, 'app'),
			publicPath: './app/',
		},
		resolve: { extensions: ['.mjs', '.js', '.json', '.html'] },
		stats: 'normal',
		module: {
			rules: [
				{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
				{
					test: /\.html$/,
					exclude: /node_modules/,
					use: { loader: 'svelte-loader', options: { css: false } },
				},
			]
		}
	};

	if (!isProd) {
		webpackConfig.devtool = 'inline-source-map';
		webpackConfig.mode = 'development';
	}
	else {
		const MinifyPlugin = require('babel-minify-webpack-plugin');
		webpackConfig.plugins = [ new MinifyPlugin() ];
	}

	return src(['src/index.js'])
		.pipe(webpackStream(webpackConfig, webpack, webpackLogger))
		.on('error', function (e) {
			console.log(e.message);
			this.emit('end');
		})
		.pipe(dest('app/'))
		.pipe(livereload());
}


function css () {
	const cssmin = require('gulp-clean-css');
	const sourcemaps = require('gulp-sourcemaps');
	const concat = require('gulp-concat');
	const stylus = require('gulp-stylus');
	const noop = require('through2').obj;

	return src(['src/ui-style/index.styl', 'src/ui-style/*.styl', 'src/**/*.styl'])
		.pipe(isProd ? noop() : sourcemaps.init())
		.pipe(stylus({ paths: ['src/ui-style/'], 'include css': true }))
		.pipe(isProd ? cssmin({ keepSpecialComments: 0 }) : noop())
		.pipe(concat('index.css'))
		.pipe(isProd ? noop() : sourcemaps.write())
		.pipe(dest('app/'))
		.pipe(livereload());
}


function electron () {
	return src('./').pipe(runElectron());
}


function watchTask () {
	livereload.listen();
	watch('src/**/*.styl', css);
	watch('src/**/*.js', js);
	watch('src/**/*.html', js);
	watch('index.js', runElectron.rerun);
	// watch('app/**/*', runElectron.rerun);

}

const defaultTask = parallel(eslint, js, css);


exports.js = js;
exports.eslint = eslint;
exports.css = css;
exports.dev = series(defaultTask, parallel(electron, watchTask));
exports.watch = series(defaultTask, watchTask);
exports.default = defaultTask;
