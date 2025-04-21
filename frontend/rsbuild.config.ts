import Dotenv from 'dotenv-webpack';
import { defineConfig, rspack } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
	html: {
		template: './public/index.html'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['postcss-loader'],
				type: 'css'
			}
			// ...
		]
	},
	tools: {
		rspack: {
			plugins: [new Dotenv()]
		}
	},
	output: {
		assetPrefix: 'auto'
	},
	plugins: [pluginReact()]
});
