export enum Environment {
  Development = 'development',
  Production = 'production',
}

export interface GOOGLE_ENV {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  CALLBACK_URL: string;
}
