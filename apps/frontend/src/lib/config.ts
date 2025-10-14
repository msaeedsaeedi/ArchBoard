interface Config {
  sessionSecret: string;
  port: number;
  environment: string;
}

export const config: Config = {
  sessionSecret: getEnvVar("SESSION_SECRET"),
  port: getEnvVarAsNumber("PORT", 3000),
  environment: getEnvVar("NODE_ENV", "development"),
};

/**
 * Helper Functions
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Environment variable ${key} is required`);
}

function getEnvVarAsNumber(key: string, defaultValue?: number): number {
  const value = getEnvVar(key, defaultValue?.toString());
  const num = parseInt(value, 10);
  if (Number.isNaN(num))
    throw new Error(`Environment variable ${key} must be a number`);
  return num;
}

function _getEnvVarAsBoolean(key: string, defaultValue?: boolean): boolean {
  const value = getEnvVar(key, defaultValue?.toString());
  return value.toLowerCase() === "true";
}
