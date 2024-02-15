import { ISecretManager } from '../../../application/interfaces/secret-manager';
import { getFromEnv } from '../../dependency-injection/common/get-env-variable';

// This is a mock of the secret manager that reads secrets from environment variables.
export class EnvvarSecretManager implements ISecretManager {
  get(secretName: string): Promise<string> {
    return Promise.resolve(getFromEnv(secretName));
  }
}
