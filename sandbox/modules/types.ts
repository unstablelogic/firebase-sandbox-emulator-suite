/**
 * Shared TypeScript types for seed modules
 */

export interface SeedOptions {
  /** Clear existing documents before seeding */
  clear?: boolean;
  /** Number of documents to generate */
  count?: number;
  /** Skip this module during seedAll */
  skip?: boolean;
}

export interface SeedResult {
  /** Name of the module */
  module: string;
  /** Number of documents created */
  created: number;
  /** Number of documents updated */
  updated?: number;
  /** Number of documents deleted (if clear was used) */
  deleted?: number;
  /** Execution time in milliseconds */
  duration: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

export interface GlobalSeedOptions {
  /** Clear all collections before seeding */
  clearAll?: boolean;
  /** Default count for all modules */
  defaultCount?: number;
  /** Modules to skip */
  skipModules?: string[];
}

export type SeedFunction = (options?: SeedOptions) => Promise<SeedResult>;

