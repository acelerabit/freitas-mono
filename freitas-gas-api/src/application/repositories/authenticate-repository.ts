interface AuthenticateUser {
  email: string;
  password: string;
}

export abstract class AuthenticateRepository {
  abstract login({ email, password }: AuthenticateUser): Promise<void>;
}
