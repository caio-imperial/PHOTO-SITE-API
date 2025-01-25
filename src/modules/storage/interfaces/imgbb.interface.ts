export interface IImgBBImage {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

export interface IImgBBStrategySuccess {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: IImgBBImage;
    medium?: IImgBBImage;
    thumb: IImgBBImage;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export interface IImgBBStrategyBad {
  status_code: number;
  error: {
    message: string;
    code: number;
  };
  status_txt: string;
}

export type IImgBBStrategyResponse = IImgBBStrategySuccess | IImgBBStrategyBad;
