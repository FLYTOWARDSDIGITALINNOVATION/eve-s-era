const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

const frontendDir = path.resolve(__dirname, "..");
const backendDir = path.resolve(frontendDir, "..", "backend");
const apiPort = 5011;
const apiHost = "127.0.0.1";
const children = [];
let stopping = false;

function portIsOpen() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: apiHost, port: apiPort });
    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

function stopChildren(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = exitCode;
}

async function start() {
  const backendAlreadyRunning = await portIsOpen();

  if (!backendAlreadyRunning) {
    const backend = spawn(process.execPath, ["server.js"], {
      cwd: backendDir,
      stdio: ["inherit", "pipe", "inherit"],
      env: { ...process.env, PORT: String(apiPort) },
    });
    children.push(backend);
    await new Promise((resolve, reject) => {
      let ready = false;
      let listening = false;
      let databaseConnected = false;
      let output = "";
      const startupTimeout = setTimeout(() => {
        reject(new Error("Backend did not connect to MongoDB within 45 seconds."));
      }, 45000);

      const markReady = () => {
        if (ready || !listening || !databaseConnected) return;
        ready = true;
        clearTimeout(startupTimeout);
        resolve();
      };

      backend.stdout.on("data", (chunk) => {
        const message = chunk.toString();
        process.stdout.write(message);
        output = (output + message).slice(-2000);
        listening ||= output.includes(`Server running on port ${apiPort}`);
        databaseConnected ||= output.includes("MongoDB Connected");
        markReady();
      });

      backend.once("error", (error) => {
        clearTimeout(startupTimeout);
        reject(error);
      });
      backend.once("exit", (code) => {
        clearTimeout(startupTimeout);
        if (!ready) {
          reject(new Error(`Backend exited before becoming ready${code === null ? "" : ` with code ${code}`}.`));
        } else if (!stopping) {
          console.error(`Backend stopped${code === null ? "" : ` with code ${code}`}.`);
          stopChildren(code || 1);
        }
      });
    });
  } else {
    console.log(`Using the backend already listening on port ${apiPort}.`);
  }

  if (stopping) return;

  const vite = spawn(process.execPath, ["node_modules/vite/bin/vite.js"], {
    cwd: frontendDir,
    stdio: "inherit",
    env: process.env,
  });
  children.push(vite);
  vite.once("error", (error) => {
    console.error("Could not start Vite:", error.message);
    stopChildren(1);
  });
  vite.once("exit", (code) => stopChildren(code || 0));
}

process.once("SIGINT", () => stopChildren());
process.once("SIGTERM", () => stopChildren());

start().catch((error) => {
  console.error("Could not start the local development servers:", error);
  stopChildren(1);
});
