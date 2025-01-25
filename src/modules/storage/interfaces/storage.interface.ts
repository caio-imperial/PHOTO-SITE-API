import { OutputFileDTO } from '../application/dto/output-file.dto';
import { UploadFileDTO } from '../application/dto/upload-file.dto';

export interface StorageStrategy {
  uploadImage(uploadFile: UploadFileDTO): Promise<OutputFileDTO>;
}
