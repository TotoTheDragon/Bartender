/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { config } from 'dotenv';
import { opendir, readFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import { Client } from 'pg';

config();
migrate();
async function migrate() {
    const client = new Client();
    const arg: string = process.argv[2] ?? 'migrations/';
    const filePaths: string[] = await findSQLFiles(arg);

    if (filePaths.length < 0) {
        console.log('Found no migrations');
    }

    await client.connect();
    console.log('Connected to database');

    for (const filePath of filePaths) {
        console.log(`Starting migration: ${basename(filePath, '.sql')}`);
        const queryString: string = (await readFile(filePath)).toString();
        const queries: string[] = queryString.split(';');
        for (const query of queries) {
            try {
                await client.query(query);
            } catch (err: any) {
                console.error('error:', err.message, 'query:', query);
                break;
            }
        }
        console.log(`Finished migration: ${basename(filePath, '.sql')}`);
    }

    console.log('Finished all migrations, closing database connection');
    client.end();
}

async function findSQLFiles(path: string): Promise<string[]> {
    if (extname(path) === '.sql') {
        return [path];
    }
    return readdirDeep(path);
}

async function readdirDeep(path: string, appendPath: boolean = true): Promise<string[]> {
    const files: string[] = [];
    const dir = await opendir(path);
    for await (const dirent of dir) {
        if (dirent.isDirectory()) {
            const dirFiles = await readdirDeep(join(path, dirent.name), false);
            files.push(...dirFiles.map((p: string) => join(dirent.name, p)));
        } else if (dirent.isFile() && extname(dirent.name) === '.sql') {
            files.push(dirent.name);
        }
    }
    if (appendPath) return files.map((filePath) => join(path, filePath));
    return files;
}
