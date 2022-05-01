import type { UserImportRecord } from 'firebase-admin/auth'
import type { UserSource } from '@/backend/utils/classes';

export interface SignInUser {
  password: string;
  email: string;
}

export interface SignUpUser extends SignInUser {
  name: string;
  avatar?: string | undefined;
  gender: string;
  age: number;
}

export interface BulkUser extends UserImportRecord {
  email: string;
  name: string;
  avatar: string;
  gender: string;
  age: number;
}

export interface RawUser {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  login: {
    username: string;
    sha256: string;
    salt: string;
  };
  dob: {
    age: number;
  };
  picture: {
    large: string;
  };
};

export type DataSource = UserSource