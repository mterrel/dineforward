import execa, { ExecaChildProcess } from 'execa';
import 'expect-puppeteer';
import path from 'path';

const localPort = '1234';
const siteUrl = `http://localhost:${localPort}`;
const loginUrl = siteUrl + '/login';
let server: ExecaChildProcess;

async function startDevServer() {
  const runner = path.resolve(__dirname, '..', '..', '..', 'runner', 'runner.js');
  const apiDir = path.resolve(__dirname, '..', '..', '..', 'df-api');

  server = execa(runner, ['dev'], {
    cwd: apiDir,
    env: {
      NODE_ENV: 'development',
      PORT: localPort,
      DISABLE_LOGGING: 'true',
    },
    stdout: 'inherit',
    stderr: 'inherit',
  });

  let title: string;
  for (let i = 30; i >= 0; i--) {
    try {
      await page.goto(siteUrl);
    } catch (err) {
      console.log(Object.keys(err), err.code, err.name, err.message);
      throw err;
    }
    title = await page.title();
    console.log(title);
    if (! /Keystone/.test(title)) return;
  }
  throw new Error(`Dev server did not become ready (page title=${title})`);
}

async function stopDevServer() {
  server.kill();
}

describe('Login page', () => {
  beforeAll(async () => {
    await startDevServer();
    await page.goto(loginUrl);
  });

  afterAll(stopDevServer);

  it('should be titled "DineForward"', async () => {
    await expect(page.title()).resolves.toMatch('DineForward');
  });
});