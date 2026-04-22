import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const budgets = {
  jsBytes: 350 * 1024,
  cssBytes: 80 * 1024,
};

const assetsDir = join(process.cwd(), "dist", "assets");
const files = readdirSync(assetsDir);

const totalJs = files
  .filter((file) => file.endsWith(".js"))
  .reduce((sum, file) => sum + statSync(join(assetsDir, file)).size, 0);
const totalCss = files
  .filter((file) => file.endsWith(".css"))
  .reduce((sum, file) => sum + statSync(join(assetsDir, file)).size, 0);

const failures = [];
if (totalJs > budgets.jsBytes) {
  failures.push(`JS budget exceeded: ${totalJs} > ${budgets.jsBytes}`);
}
if (totalCss > budgets.cssBytes) {
  failures.push(`CSS budget exceeded: ${totalCss} > ${budgets.cssBytes}`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Perf budget OK (js=${totalJs}, css=${totalCss})`);
