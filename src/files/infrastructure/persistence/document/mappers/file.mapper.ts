import { FileType } from '../../../../domain/file';
import { FileSchemaClass } from '../entities/file.schema';

export class FileMapper {
	static toDomain(raw: FileSchemaClass): FileType {
		const file = new FileType();
		file.id = raw._id.toString();
		file.path = raw.path;
		return file;
	}
	static toPersistence(file) {
		const fileEntity = new FileType();
		if (file.id) {
			fileEntity.id = file.id;
		}
		fileEntity.path = file.path;
		return fileEntity;
	}
}
