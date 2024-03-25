/* eslint-disable */
import { spawn } from 'child_process';

var __TEARDOWN_MESSAGE__: string;

module.exports = async function() {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  // Start the API server
  const server = await spawn('nx', ['serve', 'api'], {
    shell: true,
    stdio: 'inherit',
  });

  // Store the server process in globalThis so it can be accessed in globalTeardown
  globalThis.__SERVER_PROCESS__ = server;
  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';

  // This is a simplistic approach; consider polling a health endpoint instead
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

