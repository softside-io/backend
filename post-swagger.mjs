import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontEndApiPath = path.join(
	__dirname,
	'..',
	'frontend',
	'projects',
	'api',
);
const modelsPath = path.join(frontEndApiPath, 'model');
const servicesPath = path.join(frontEndApiPath, 'api');

startPostProcessing();

function startPostProcessing() {
	findAndProcessFiles(
		modelsPath,
		processEnumFile,
		removeModelVoidFile,
		removeExportVoidType,
	);
	findAndProcessFiles(servicesPath, processFileForVoid);
	console.log('Completed processing all directories.');
}

function findAndProcessFiles(startPath, ...functions) {
	let entries;
	try {
		entries = fs.readdirSync(startPath, { withFileTypes: true });
	} catch (err) {
		console.error(`Error reading the directory ${startPath}:`, err);
		return;
	}

	for (let entry of entries) {
		const entryPath = path.join(startPath, entry.name);
		if (entry.isFile()) {
			for (const func of functions) {
				func(entryPath);
			}
		}
	}
}

function processEnumFile(filePath) {
	if (!filePath.endsWith('Enum.ts')) return;

	const fileName = path.basename(filePath, '.ts');
	// Assuming the file name directly translates to the enum name
	const enumName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

	try {
		const file = fs.readFileSync(filePath, 'utf8');

		const updatedData = file
			.replace(
				new RegExp(`export type ${enumName} = (.+?);`, 'gs'),
				(match, p1) => {
					const enums = p1.split('|').map((s) => {
						const num = s.match(/\d+/)[0]; // Extract number
						return num;
					});
					return `export type ${enumName} = ${enums.join(' | ')};`;
				},
			)
			.replace(
				new RegExp(`export const ${enumName} = {([\\s\\S]+?)};`, 'gm'),
				(match, p1) => {
					const consts = p1
						.trim()
						.split(',\n')
						.map((s) => {
							const [key, value] = s
								.split(':')
								.map((s) => s.trim());
							const newKey = key.replace(/\d+/, ''); // Remove digits from key
							const newValue = value.match(/\d+/)[0]; // Extract number from value
							return `    ${newKey}: ${newValue} as ${enumName}`;
						});
					return `export const ${enumName} = {\n${consts.join(
						',\n',
					)}\n};`;
				},
			);

		try {
			fs.writeFileSync(filePath, updatedData, 'utf8');
			console.log(`${filePath} has been successfully converted.`);
		} catch (err) {
			console.error(`Error writing the file ${filePath}:`, err);
		}
	} catch (err) {
		console.error(`Error reading the file ${filePath}:`, err);
	}
}

function processFileForVoid(filePath) {
	try {
		let data = fs.readFileSync(filePath, 'utf8');
		// Remove the import line for ModelVoid
		data = data.replace(
			/import { ModelVoid } from '\.\.\/model\/modelVoid';\n?/,
			'',
		);
		// Replace all ModelVoid with void
		data = data.replace(/\bModelVoid\b/g, 'void');

		fs.writeFileSync(filePath, data, 'utf8');
		console.log(
			`${filePath} successfully processed for void return types.`,
		);
	} catch (err) {
		console.error(`Error processing the file ${filePath}:`, err);
	}
}

function removeModelVoidFile(filePath) {
	if (!filePath.endsWith('modelVoid.ts')) return;

	try {
		fs.unlinkSync(filePath);
		console.log(`${filePath} has been removed.`);
	} catch (err) {
		console.error(`Error removing the file ${filePath}:`, err);
	}
}

function removeExportVoidType(filePath) {
	if (!filePath.endsWith('models.ts')) return;

	try {
		let data = fs.readFileSync(filePath, 'utf8');
		data = data.replace(/export \* from \'\.\/modelVoid\';\n?/, '');
		console.log(data);

		fs.writeFileSync(filePath, data, 'utf8');
		console.log(
			`${filePath} successfully processed for removing modelVoid export.`,
		);
	} catch (err) {
		console.error(`Error processing the file ${filePath}:`, err);
	}
}
