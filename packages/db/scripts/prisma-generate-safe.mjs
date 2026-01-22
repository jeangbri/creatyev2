
const { spawn } = require('child_process');
const path = require('path');

if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL environment variable is missing.');
    console.warn('   Skipping Prisma generation to prevent install failure.');
    console.warn('   This is expected during "pnpm install" on Vercel if env vars are restricted.');
    process.exit(0);
}

console.log('✅ DATABASE_URL found. Running prisma generate...');

const prismaPath = path.resolve(__dirname, '../node_modules/.bin/prisma');
// Use npx or direct path? straightforward spawn 'prisma' might rely on path.
// Better to use 'npx prisma' or just 'prisma' if in scripts.
// The user asked to spawn prisma generate. 
// Let's use 'npx prisma generate' for safety or just 'prisma' if we trust path.
// Given we are running via npm script "node ...", we can spawn the command.

const child = spawn('npx', ['prisma', 'generate', '--schema=./prisma/schema.prisma'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.resolve(__dirname, '..') // Run from packages/db root
});

child.on('close', (code) => {
    process.exit(code);
});
