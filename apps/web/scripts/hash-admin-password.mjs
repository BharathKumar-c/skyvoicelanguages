// Prints an ADMIN_PASSWORD_HASH line for the server environment.
// Usage: pnpm --filter @skyvoice/web admin:hash-password
// The password is read from a hidden prompt, never from command-line arguments
// (which would end up in shell history).
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await ask("New admin password (min 12 characters): ");
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
const confirm = await ask("Repeat password: ");
if (confirm !== password) {
  console.error("Passwords do not match.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`\nADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64")}:${hash.toString("base64")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
console.log("\nAdd both lines to the server environment (e.g. apps/web/.env.local or your host's settings).");
