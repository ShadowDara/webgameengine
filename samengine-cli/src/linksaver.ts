#!/usr/bin/env node

// linksaver.ts
// TypeScript version of your Python Linksaver CLI

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { exec } from "child_process";
import chalk from 'chalk';
import { mkdir } from "fs/promises";

const BASE_DIR = process.cwd();
const PATH = join(BASE_DIR, ".samengine/", "linksaver.json");

class ConfigError extends Error { }

// Types
export type Link = {
    name?: string;
    link: string;
    description: string;
    license?: string;
    author?: string;
    licenselink?: string;
};

// Config
export type AppConfig = {
    projectname: string;
    pretty: boolean;
    links: Link[];
};

// Function to generate a new Link
function newLink(link = "", description = "", license?: string, name?: string, author?: string, licenselink?: string): Link {
    const linkObj: Link = { link, description };

    if (license) {
        linkObj.license = license;
    }
    if (name) {
        linkObj.name = name;
    }
    if (author) {
        linkObj.author = author;
    }
    if (licenselink) {
        linkObj.licenselink = licenselink;
    }

    return linkObj;
}

function newAppConfig(projectname = ""): AppConfig {
    return {
        projectname,
        pretty: true,
        links: [],
    };
}

function requireString(data: any, key: string): string {
    const value = data[key];
    if (typeof value !== "string") {
        throw new Error(`${key} must be a string`);
    }
    return value;
}

function requireBool(data: any, key: string): boolean {
    const value = data[key];
    if (typeof value !== "boolean") {
        throw new Error(`${key} must be a boolean`);
    }
    return value;
}

function loadConfig(path: string): AppConfig {
    if (!existsSync(path)) {
        throw new ConfigError(`Config file not found: ${path}`);
    }

    let data: any;
    try {
        data = JSON.parse(readFileSync(path, "utf-8"));
    } catch (e) {
        throw new ConfigError(`Invalid JSON: ${e}`);
    }

    if (typeof data !== "object" || data === null) {
        throw new ConfigError("Config root must be an object");
    }

    try {
        if (!Array.isArray(data.links)) {
            throw new Error("links must be a list");
        }

        const links: Link[] = data.links.map((item: any, i: number) => {
            if (typeof item !== "object") {
                throw new Error(`links[${i}] must be an object`);
            }

            if (typeof item.link !== "string") {
                throw new Error(`links[${i}].link must be a string`);
            }

            if (typeof item.description !== "string") {
                throw new Error(`links[${i}].description must be a string`);
            }

            const linkObj: Link = {
                link: item.link,
                description: item.description,
            };

            if (typeof item.license === "string") {
                linkObj.license = item.license;
            }
            if (typeof item.name === "string") {
                linkObj.name = item.name;
            }
            if (typeof item.author === "string") {
                linkObj.author = item.author;
            }
            if (typeof item.licenselink === "string") {
                linkObj.licenselink = item.licenselink;
            }

            return linkObj;
        });

        return {
            projectname: requireString(data, "projectname"),
            pretty: requireBool(data, "pretty"),
            links,
        };
    } catch (e) {
        throw new ConfigError(`Invalid config structure: ${e}`);
    }
}

function saveConfig(config: AppConfig) {
    const indent = config.pretty ? 4 : undefined;

    writeFileSync(PATH, JSON.stringify(config, null, indent), "utf-8");
    console.log("Config saved.");
}

async function prompt(question: string): Promise<string> {
    const readline = await import("readline");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function init() {
    console.log("Init Linksaver for Project");

    await mkdir(".webgameengine", { recursive: true });

    if (existsSync(PATH)) {
        console.log(`Config file already exists: ${PATH}`);
        return;
    }

    const projectname = await prompt("Projectname: ");
    const config = newAppConfig(projectname);

    saveConfig(config);
    console.log(`Created config file at ${PATH}`);
}

async function addLink(config: AppConfig) {
    const newName = await prompt("Name (optional): ");
    const newLinkVal = await prompt("New Link: ");
    const newDesc = await prompt("New Description: ");
    const newAuthor = await prompt("Author (optional): ");
    const newLic = await prompt("License (optional): ");
    const newLicenseLink = await prompt("License Link (optional): ");

    config.links.push(newLink(newLinkVal, newDesc, newLic, newName, newAuthor, newLicenseLink));
    console.log("Added new Link!");

    saveConfig(config);
}

function viewLinks(config: AppConfig): void {
    for (const link of config.links) {
        const parts = [
            `[${chalk.green(link.link)}]`,
            link.name ? `Name: ${link.name}` : null,
            `Desc: ${link.description}`,
            link.author ? `Author: ${link.author}` : null,
            link.license ? `License: ${chalk.red(link.license)}` : null,
            link.licenselink ? `License URL: ${link.licenselink}` : null,
        ].filter(Boolean);

        console.log(parts.join(" | "));
    }
}

function listLinks(config: AppConfig): void {
    for (const link of config.links) {
        let part = `"${link.name}" (${link.link}) by ${link.author} is licensed under ${link.license} (${link.licenselink})\n`;

        console.log(part);
    }
}

function openLink(link: string) {
    const platform = process.platform;
    let cmd = "";

    // Open Link on Windows
    if (platform === "win32") cmd = `start "" "${link}"`;
    // Open on Mac
    else if (platform === "darwin") cmd = `open "${link}"`;
    // Open on Linux and others
    else cmd = `xdg-open "${link}"`;

    exec(cmd, (err) => {
        if (err) console.error("Error opening link:", err);
    });
}

function openLinks(config: AppConfig) {
    console.log("Opening Links ...");
    for (const link of config.links) {
        openLink(link.link);
    }
}

function printhelp() {
    console.log(`
LINKSAVER CLI by webgameengine

Commands:
    help    show this message
    init    create a new Config
    add     add a new Link into the File
    view    view the links in the Terminal
    (none)  opening links in the browser
`);
}

// Main
// main.ts oder linksaver.ts
async function main() {
    // console.log("Linksaver TS");

    try {
        const args = process.argv.slice(2);

        if (args[0] === "-h" || args[0] === "--help" || args[0] === "help") {
            printhelp();
            return;
        }

        if (args[0] === "init") {
            await init();
            return;
        }

        let config: AppConfig;

        try {
            config = loadConfig(PATH);
        } catch (err) {
            if (err instanceof ConfigError) {
                console.error(chalk.red("⚠️  Config Error:", err.message));
                console.error("Please run 'init' to create a Config before.");
                process.exit(1);
            } else {
                throw err; // alles andere weiter werfen
            }
        }

        if (args[0] === "add") {
            await addLink(config);
            return;
        }

        if (args[0] === "view") {
            viewLinks(config);
            return;
        }

        if (args[0] === "list") {
            listLinks(config);
            return;
        }

        openLinks(config);

    } catch (err) {
        console.error("Unerwarteter Fehler:", err);
        process.exit(1);
    }
}

await main();
