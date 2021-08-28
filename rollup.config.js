import html from 'rollup-plugin-html';
import scss from 'rollup-plugin-scss';
import typescript from 'rollup-plugin-typescript';
import packageJson from './package.json';

const userScriptBanner = `
// ==UserScript==
// @name         ${packageJson.name}
// @namespace    https://github.com/hotarunx
// @version      ${packageJson.version}
// @description  ${packageJson.description}
// @author       ${packageJson.author}
// @license      ${packageJson.license}
// @supportURL   ${packageJson.bugs.url}
// @match        https://dem08656775.github.io/newincrementalgame/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.12/push.min.js
// ==/UserScript==`.trim();

export default [
    {
        input: 'src/main.ts',
        output: {
            banner: userScriptBanner,
            file: 'dist/dist.js',
        },
        plugins: [
            html({
                include: '**/*.html',
            }),
            scss({
                output: false,
            }),
            typescript(),
        ],
    },
];
