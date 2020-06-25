import fs from 'fs';
import http from 'http';
import libstatic from 'node-static';
import socketIO, { Socket } from 'socket.io';

const getEnvVar = (key: string) => {
	const val = process.env[key];
	if (!val) {
		throw new Error(`Must specify a ${key} env var`);
	}
	return val;
};

const fileServer = new libstatic.Server('../client/build');

const server = http.createServer((req, res) => {
	if (
		!['localhost:3000', 'localhost:3001', 'gameofkings.io'].includes(
			req.headers.host || '',
		)
	) {
		console.error(`Not responding to request to host ${req.headers.host}`);
		req.destroy();
		return;
	}

	req
		.addListener('end', () =>
			fileServer.serve(req, res, (err) => {
				if (err && (err as any).status === 404) {
					fileServer.serveFile('/index.html', 200, {}, req, res);
				}
			}),
		)
		.resume();
});

export const io = socketIO(server);

server.listen(getEnvVar('PORT'));
