import { context } from 'esbuild';
import InlineImportPlugin from 'esbuild-plugin-inline-import';
/**
 * @type {string[]}
 */
const processArguments = process.argv.slice(2);

const shouldWatch = processArguments.includes('-w');

const outputFileIndex = processArguments.findIndex(
	(argument) => argument === '-o',
);
const outputFile =
	outputFileIndex === -1
		? './dist/index.js'
		: processArguments[outputFileIndex + 1];

console.log('Outputting to: ', outputFile);

const userScriptDefinition = `// ==UserScript==
// @name         Refined BearBlog
// @namespace    http://github.com/YannickFricke
// @version      0.1
// @description  A better BearBlog.dev UX
// @author       Yannick Fricke
// @match        https://bearblog.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bearblog.dev
// @grant        none
// ==/UserScript==`;

(async () => {
	const buildContext = await context({
		entryPoints: ['./src/index.ts'],
		outfile: outputFile,
		banner: {
			js: userScriptDefinition,
		},
		logLevel: 'info',
		color: true,
		bundle: true,
		plugins: [InlineImportPlugin()],
	});

	await buildContext.rebuild();

	if (shouldWatch) {
		await buildContext.watch();
	} else {
		await buildContext.dispose();
	}
})();
