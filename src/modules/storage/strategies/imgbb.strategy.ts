import { Injectable, Logger } from '@nestjs/common';
import { StorageStrategy } from '../interfaces/storage.interface';
import { HttpService } from '@nestjs/axios';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { IImgBBStrategyResponse } from '../interfaces/imgbb.interface';

@Injectable()
export class IMGBBStrategy implements StorageStrategy {
  private readonly logger = new Logger(IMGBBStrategy.name);
  private readonly baseUrl = process.env.IMGBB_BASE_URL;
  private readonly key = process.env.IMGBB_API_KEY;
  private readonly httpClient: AxiosInstance;

  constructor(private readonly httpService: HttpService) {
    this.httpClient = this.httpService.axiosRef;
    this.httpClient.defaults.baseURL = this.baseUrl;
  }
  async uploadImage(uploadFile) {
    const params = new URLSearchParams();
    params.append('key', this.key);

    if (uploadFile.name) {
      params.append('name', uploadFile.name);
    }

    const formData = new FormData();
    formData.append('image', uploadFile.file.buffer.toString('base64'));

    const { data } = await firstValueFrom(
      this.httpService.post<IImgBBStrategyResponse>(`/upload`, formData, {
        params: params,
        headers: { ...formData.getHeaders() },
      }),
    );

    if (!('data' in data)) {
      this.logger.error(data);
      return {
        error: {
          message: data.error.message,
        },
      };
    }

    function calculateSize(
      height: number,
      width: number,
      baseSize: number,
    ): { width: number; height: number } {
      if (width > height) {
        return {
          width: baseSize,
          height: Math.round(height * (baseSize / width)),
        };
      } else if (width < height) {
        return {
          height: baseSize,
          width: Math.round(width * (baseSize / height)),
        };
      }
      return {
        height: height,
        width: width,
      };
    }

    const imageSizes = {
      full: {
        height: data.data.height,
        width: data.data.width,
        ...data.data.image,
      },
      medium: data.data.medium
        ? {
            ...calculateSize(data.data.height, data.data.width, 640),
            ...data.data.medium,
          }
        : null,
      thumb: {
        height: 180,
        width: 180,
        ...data.data.thumb,
      },
    };
    if (!imageSizes.medium) {
      imageSizes.medium = {
        ...calculateSize(data.data.height, data.data.width, 640),
        mime: data.data.image.mime,
        ...data.data.image,
      };
    }

    return {
      data: {
        id: data.data.id,
        title: data.data.title,
        url: data.data.url,
        name: data.data.image.filename,
        size: data.data.size,
        type: 'image',
        mime: data.data.image.mime,
        extension: data.data.image.extension,
        time: data.data.time,
        image: imageSizes,
      },
    };
  }
}
