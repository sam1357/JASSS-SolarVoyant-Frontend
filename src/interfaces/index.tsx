export type Session =
  | {
      user?: User;
      accessToken?: string;
      expires?: string;
      error?: string;
    }
  | null
  | undefined;

export interface User {
  email?: string;
  name?: string;
  image?: string;
  id?: string;
}

export interface UserDataAuthResponse {
  id: string;
}

export type APIResponse = {
  status: number;
  json?: { error?: string };
};
