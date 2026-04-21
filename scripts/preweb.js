// Script which runs before the Next Build Command for the Website

import fs from "fs/promises";

await fs.cp("../docs", "docs", {
  recursive: true,
});
