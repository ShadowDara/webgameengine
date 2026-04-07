// Print the Version from a Version file in the Project

import { version } from "@shadowdara/webgameengine/build"
import chalk from 'chalk';

console.log(chalk.red("\nCurrent Version in Version file in the project: " + version() + "\n"));
