export interface ISecretManager {
  get(secretName: string): Promise<string>;
}
