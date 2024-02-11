import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
let finalPath = rootDir;

if (os.platform() === 'win32') {
	finalPath = convertWindowsPathToWSL(rootDir);
	executeDockerCommand(finalPath, false, false);
} else {
	executeDockerCommand(finalPath, true, true);
}

function convertWindowsPathToWSL(windowsPath) {
	// Convert drive letter to lowercase and replace backslashes with forward slashes
	const drive = windowsPath.substring(0, 1).toLowerCase();
	const pathWithoutDrive = windowsPath.substring(2).replace(/\\/g, '/');
	// Return the WSL path
	return `/${drive}${pathWithoutDrive}`;
}

function executeDockerCommand(volumePath, includeUser, includeNetwork) {
	let dockerCommand = `docker run --rm `;
	if (includeNetwork) {
		dockerCommand += `--network='host' `;
	}
	dockerCommand += `-v "${volumePath}:/local" `;
	if (includeUser) {
		dockerCommand += `--user $(id -u):$(id -g) `;
	}
	dockerCommand += `swaggerapi/swagger-codegen-cli-v3:3.0.41 generate -i http://localhost:3000/docs-json -l typescript-angular -o /local/frontend/projects/api -c /local/backend/.swaggerrc.json`;

	if (os.platform() === 'win32') {
		dockerCommand = dockerCommand.replace(
			'http://localhost:3000',
			'http://host.docker.internal:3000',
		);
	}

	try {
		execSync(dockerCommand, { stdio: 'inherit' });
	} catch (error) {
		console.error(`Failed to execute Docker command: ${error}`);
	}
}
