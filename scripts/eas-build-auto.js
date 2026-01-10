#!/usr/bin/env node

/**
 * Automatically answers "yes" to EAS build prompts like Keystore generation.
 * Usage: node scripts/eas-build-auto.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Change to hello-world directory
const projectDir = path.join(__dirname, '..', 'hello-world');

console.log(`Starting EAS build in: ${projectDir}\n`);

const easBuild = spawn('npx', ['eas', 'build', '-p', 'android', '--profile', 'dev'], {
  cwd: projectDir,
  stdio: ['pipe', 'pipe', 'pipe']
});

let outputBuffer = '';

// Handle stdout
easBuild.stdout.on('data', (data) => {
  const text = data.toString();
  process.stdout.write(text);
  outputBuffer += text;

  // Auto-answer Keystore generation prompt
  if (text.includes('Generate a new Android Keystore?')) {
    console.log('\n[Auto-answering: Yes]');
    easBuild.stdin.write('y\n');
  }
});

// Handle stderr
easBuild.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Handle process exit
easBuild.on('close', (code) => {
  console.log(`\nEAS build exited with code ${code}`);
  process.exit(code);
});

// Handle errors
easBuild.on('error', (error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\nInterrupted. Stopping EAS build...');
  easBuild.kill('SIGINT');
  process.exit(130);
});
