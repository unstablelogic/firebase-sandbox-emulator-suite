/**
 * Sandbox Configuration
 * 
 * This file contains configuration for the sandbox environment including
 * emulator ports, module discovery, and admin panel settings.
 */

export interface SandboxConfig {
  /** Emulator port configuration */
  ports: {
    firestore: number;
    auth: number;
    functions: number;
    hosting: number;
    ui: number;
  };
  
  /** Admin panel configuration */
  adminPanel: {
    enabled: boolean;
    route: string;
  };
  
  /** Seed module configuration */
  seeding: {
    modulesPath: string;
    templatesPath: string;
    defaultCount: number;
  };
  
  /** Logging configuration */
  logging: {
    logsPath: string;
    maxLogEntries: number;
  };
}

export const sandboxConfig: SandboxConfig = {
  ports: {
    firestore: 8080,
    auth: 9099,
    functions: 5001,
    hosting: 5000,
    ui: 4000
  },
  
  adminPanel: {
    enabled: true,
    route: '/sandbox'
  },
  
  seeding: {
    modulesPath: './sandbox/modules',
    templatesPath: './sandbox/seed-data',
    defaultCount: 10
  },
  
  logging: {
    logsPath: './sandbox-logs',
    maxLogEntries: 1000
  }
};

/**
 * List available seed modules
 */
export function listModules(): string[] {
  // This would be implemented to dynamically discover modules
  // For now, return the example modules
  return ['users', 'products', 'orders', 'config'];
}

/**
 * Seed a specific module
 */
export async function seedModule(name: string, options: any = {}): Promise<any> {
  try {
    // Dynamic import of seed module
    const module = await import(`../sandbox/modules/${name}.seed`);
    const seedFunction = module[`seed${name.charAt(0).toUpperCase() + name.slice(1)}`];
    
    if (!seedFunction) {
      throw new Error(`Seed function not found for module: ${name}`);
    }
    
    return await seedFunction(options);
  } catch (error) {
    throw new Error(`Failed to seed module ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Seed all modules
 */
export async function seedAll(options: any = {}): Promise<any[]> {
  const modules = listModules();
  const results = [];
  
  for (const module of modules) {
    try {
      const result = await seedModule(module, options);
      results.push(result);
    } catch (error) {
      results.push({
        module,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

