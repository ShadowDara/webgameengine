import fs from "fs";
import path from "path";

/**
 * Gibt die Version eines installierten npm-Pakets zurück.
 * @param packageName - Name des Pakets (z.B. "lodash")
 * @param projectRoot - Root-Verzeichnis des Projekts (optional)
 * @returns Version als string oder null, wenn nicht gefunden
 */
export function getPackageVersion(
  packageName: string,
  projectRoot: string = process.cwd()
): string | null {
  try {
    const packageJsonPath = path.join(
      projectRoot,
      "node_modules",
      packageName,
      "package.json"
    );

    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    ) as { version?: string };

    return packageJson.version ?? null;
  } catch {
    return null;
  }
}
