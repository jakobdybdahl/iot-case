export class MissingKeyError extends Error {
  public constructor(key: string) {
    super(`The environment variable with key '${key}' could not be found`);
  }
}

export const getFromEnv = <K extends string>(
  key: string,
  defaultValue?: K,
): K => {
  const value = process.env[key];
  if (value) return value as K;
  if (defaultValue) return defaultValue;
  throw new MissingKeyError(key);
};

export const getFromEnvSafe = (
  ...parameters: Parameters<typeof getFromEnv>
): string | undefined => {
  try {
    return getFromEnv(...parameters);
  } catch (e: unknown) {
    return undefined;
  }
};
