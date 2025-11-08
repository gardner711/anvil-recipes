# Environment Configuration Implementation

## Metadata

- **Name**: Environment Configuration Implementation
- **Type**: Enabler
- **ID**: ENB-621847
- **Approval**: Approved
- **Capability ID**: CAP-834521
- **Owner**: Product Team
- **Status**: Ready for Implementation
- **Priority**: High
- **Analysis Review**: Required
- **Code Review**: Required

## Technical Overview
### Purpose
Implements environment-specific configuration management for the player character service using environment variables, .env files for development, and secure configuration loading with validation for development, staging, and production environments.

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-ENV001 | Environment Detection | The service SHALL detect NODE_ENV and default to 'development' if not set | High | Ready for Implementation | Approved |
| FR-ENV002 | Dotenv Loading | The service SHALL load .env files in development using dotenv package | High | Ready for Implementation | Approved |
| FR-ENV003 | Configuration Module | The service SHALL provide a centralized config module exporting all settings | High | Ready for Implementation | Approved |
| FR-ENV004 | Database Config | The service SHALL load MONGODB_URI with environment-specific defaults | High | Ready for Implementation | Approved |
| FR-ENV005 | Server Config | The service SHALL load PORT, HOST, and BASE_URL configurations | High | Ready for Implementation | Approved |
| FR-ENV006 | CORS Config | The service SHALL load and parse CORS_ORIGIN (supports comma-separated list) | High | Ready for Implementation | Approved |
| FR-ENV007 | Logging Config | The service SHALL configure log level based on environment (debug/info/warn) | High | Ready for Implementation | Approved |
| FR-ENV008 | Security Config | The service SHALL load rate limiting and request size limit settings | High | Ready for Implementation | Approved |
| FR-ENV009 | Feature Flags | The service SHALL load boolean feature flags from environment variables | Medium | Ready for Implementation | Approved |
| FR-ENV010 | Validation | The service SHALL validate required configuration values at startup | High | Ready for Implementation | Approved |
| FR-ENV011 | Error Handling | The service SHALL throw clear errors for missing required configuration | High | Ready for Implementation | Approved |
| FR-ENV012 | Config Summary | The service SHALL log configuration summary at startup (without secrets) | Medium | Ready for Implementation | Approved |

## Non-Functional Requirements

| ID | Name | Type | Requirement | Priority | Status | Approval |
|----|------|------|-------------|----------|--------|----------|
| NFR-ENV001 | Load Time | Performance | Configuration loading SHALL complete within 100ms | Medium | Ready for Implementation | Approved |
| NFR-ENV002 | Secret Security | Security | Secrets SHALL never be logged or exposed in error messages | High | Ready for Implementation | Approved |
| NFR-ENV003 | Type Safety | Reliability | Configuration values SHALL be properly typed (string, number, boolean) | High | Ready for Implementation | Approved |
| NFR-ENV004 | Documentation | Maintainability | All configuration options SHALL be documented in .env.example | High | Ready for Implementation | Approved |

## Dependencies

### Internal Upstream Dependency

| Enabler ID | Description |
|------------|-------------|
| | None - Foundational configuration enabler |

### Internal Downstream Impact

| Enabler ID | Description |
|------------|-------------|
| ENB-492038 | MongoDB Character Database - Uses database configuration |
| ENB-432891 | Create API - Uses server and security configuration |
| ENB-813945 | List API - Uses server and security configuration |
| ENB-745321 | Update API - Uses server and security configuration |
| ENB-536812 | Delete API - Uses server and security configuration |
| ENB-228934 | TDD Implementation - Uses test environment configuration |
| ENB-924156 | Performance Monitoring - Uses monitoring configuration |

### External Dependencies

**External Upstream Dependencies**: 
- dotenv - Environment variable loading
- Node.js process.env - Environment variable access

**External Downstream Impact**: All service components depend on this configuration

## Technical Specifications

### Enabler Dependency Flow Diagram
```mermaid
flowchart TD
    ENB_621847["ENB-621847<br/>Environment Configuration<br/>⚙️"]
    
    ENV_FILE[".env File<br/>Development Only<br/>📄"]
    ENV_VARS["Environment Variables<br/>Staging/Production<br/>🔐"]
    DOTENV["dotenv Package<br/>Load .env<br/>📦"]
    
    VALIDATION["Configuration Validation<br/>Required Values Check<br/>✓"]
    CONFIG_OBJ["Config Object<br/>Typed Settings<br/>📋"]
    
    DB_CONFIG["Database Config<br/>MongoDB URI<br/>💾"]
    SERVER_CONFIG["Server Config<br/>Port, CORS, Security<br/>🌐"]
    LOG_CONFIG["Logging Config<br/>Level, Format<br/>📝"]
    FEATURE_FLAGS["Feature Flags<br/>Boolean Toggles<br/>🚩"]
    
    ENV_FILE -->|Development| DOTENV
    DOTENV -->|Loads into| ENV_VARS
    ENV_VARS -->|Reads| ENB_621847
    
    ENB_621847 --> VALIDATION
    VALIDATION -->|Invalid| ERROR["Startup Error<br/>Missing Config<br/>❌"]
    VALIDATION -->|Valid| CONFIG_OBJ
    
    CONFIG_OBJ --> DB_CONFIG
    CONFIG_OBJ --> SERVER_CONFIG
    CONFIG_OBJ --> LOG_CONFIG
    CONFIG_OBJ --> FEATURE_FLAGS
    
    DB_CONFIG --> APP_SERVICES["Application Services<br/>Use Configuration<br/>🚀"]
    SERVER_CONFIG --> APP_SERVICES
    LOG_CONFIG --> APP_SERVICES
    FEATURE_FLAGS --> APP_SERVICES

    classDef enabler fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef source fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef process fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef config fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px
    
    class ENB_621847 enabler
    class ENV_FILE,ENV_VARS,DOTENV source
    class VALIDATION,CONFIG_OBJ process
    class DB_CONFIG,SERVER_CONFIG,LOG_CONFIG,FEATURE_FLAGS config
    class ERROR error
    class APP_SERVICES config
```

### Configuration Files

#### .env.example
```bash
# ==============================================
# Player Character Service - Environment Configuration
# Copy this file to .env for local development
# ==============================================

# ----------------
# Environment
# ----------------
NODE_ENV=development

# ----------------
# Database
# ----------------
MONGODB_URI=mongodb://localhost:27017/player_characters
# Production example: mongodb+srv://username:password@cluster.mongodb.net/player_characters

# Database Pool Settings (optional)
MONGODB_POOL_MIN=10
MONGODB_POOL_MAX=50

# ----------------
# Server
# ----------------
PORT=3001
HOST=localhost
BASE_URL=http://localhost:3001

# ----------------
# CORS
# ----------------
# Development: Allow all origins
CORS_ORIGIN=*
# Production: Specific origins (comma-separated)
# CORS_ORIGIN=https://app.example.com,https://www.example.com

# ----------------
# Logging
# ----------------
# Options: debug, info, warn, error
LOG_LEVEL=debug
LOG_FORMAT=pretty
# Production: LOG_FORMAT=json

# ----------------
# Security
# ----------------
# Rate Limiting
RATE_LIMIT_ENABLED=false
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
# 900000ms = 15 minutes

# Request Size Limits
REQUEST_SIZE_LIMIT=10mb
# Production: REQUEST_SIZE_LIMIT=1mb

# ----------------
# Feature Flags
# ----------------
FEATURE_SPELLCASTING=true
FEATURE_MULTICLASS=false
FEATURE_HOMEBREW_CONTENT=false

# ----------------
# Monitoring (Production)
# ----------------
# ENABLE_APM=true
# APM_SERVICE_NAME=player-character-service
# APM_SERVER_URL=https://apm.example.com

# ----------------
# Secrets (DO NOT COMMIT REAL VALUES)
# ----------------
# JWT_SECRET=your-secret-key-here
# API_KEY=your-api-key-here
```

#### src/config/index.js
```javascript
/**
 * @fileoverview Centralized configuration management for the player character service.
 * Loads and validates environment-specific configuration from environment variables.
 * 
 * @module config
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file in development
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '../../.env');
  dotenv.config({ path: envPath });
}

/**
 * Environment types
 */
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

/**
 * Get environment variable with type conversion and validation.
 * 
 * @param {string} key - Environment variable name
 * @param {*} defaultValue - Default value if not set
 * @param {boolean} required - Whether the variable is required
 * @returns {*} The environment variable value
 * @throws {Error} If required variable is missing
 */
function getEnvVar(key, defaultValue = undefined, required = false) {
  const value = process.env[key];
  
  if (value === undefined || value === '') {
    if (required) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return defaultValue;
  }
  
  return value;
}

/**
 * Get environment variable as integer.
 * 
 * @param {string} key - Environment variable name
 * @param {number} defaultValue - Default value if not set
 * @returns {number} The parsed integer value
 */
function getEnvInt(key, defaultValue) {
  const value = getEnvVar(key, String(defaultValue));
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid integer`);
  }
  
  return parsed;
}

/**
 * Get environment variable as boolean.
 * 
 * @param {string} key - Environment variable name
 * @param {boolean} defaultValue - Default value if not set
 * @returns {boolean} The parsed boolean value
 */
function getEnvBool(key, defaultValue) {
  const value = getEnvVar(key, String(defaultValue));
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Get environment variable as array (comma-separated).
 * 
 * @param {string} key - Environment variable name
 * @param {Array} defaultValue - Default value if not set
 * @returns {Array<string>} The parsed array
 */
function getEnvArray(key, defaultValue = []) {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

// Detect current environment
const nodeEnv = getEnvVar('NODE_ENV', ENVIRONMENTS.DEVELOPMENT);
const isDevelopment = nodeEnv === ENVIRONMENTS.DEVELOPMENT;
const isStaging = nodeEnv === ENVIRONMENTS.STAGING;
const isProduction = nodeEnv === ENVIRONMENTS.PRODUCTION;

/**
 * Application configuration object.
 * Centralizes all environment-specific settings.
 */
const config = {
  // Environment
  env: nodeEnv,
  isDevelopment,
  isStaging,
  isProduction,
  
  // Server Configuration
  server: {
    port: getEnvInt('PORT', 3001),
    host: getEnvVar('HOST', 'localhost'),
    baseUrl: getEnvVar('BASE_URL', `http://localhost:${getEnvInt('PORT', 3001)}`),
  },
  
  // Database Configuration
  database: {
    uri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/player_characters', true),
    poolMin: getEnvInt('MONGODB_POOL_MIN', isDevelopment ? 10 : 10),
    poolMax: getEnvInt('MONGODB_POOL_MAX', isDevelopment ? 20 : 50),
  },
  
  // CORS Configuration
  cors: {
    origin: (() => {
      const origins = getEnvArray('CORS_ORIGIN', ['*']);
      // In development, allow all origins if '*' is specified
      return origins.includes('*') && isDevelopment ? '*' : origins;
    })(),
    credentials: true,
  },
  
  // Logging Configuration
  logging: {
    level: getEnvVar('LOG_LEVEL', isDevelopment ? 'debug' : isProduction ? 'warn' : 'info'),
    format: getEnvVar('LOG_FORMAT', isDevelopment ? 'pretty' : 'json'),
    logRequests: isDevelopment,
  },
  
  // Security Configuration
  security: {
    rateLimiting: {
      enabled: getEnvBool('RATE_LIMIT_ENABLED', !isDevelopment),
      maxRequests: getEnvInt('RATE_LIMIT_MAX_REQUESTS', isDevelopment ? 1000 : 100),
      windowMs: getEnvInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
    },
    requestSizeLimit: getEnvVar('REQUEST_SIZE_LIMIT', isDevelopment ? '10mb' : '1mb'),
  },
  
  // Feature Flags
  features: {
    spellcasting: getEnvBool('FEATURE_SPELLCASTING', true),
    multiclass: getEnvBool('FEATURE_MULTICLASS', false),
    homebrewContent: getEnvBool('FEATURE_HOMEBREW_CONTENT', false),
  },
  
  // Monitoring Configuration (Production)
  monitoring: {
    enabled: getEnvBool('ENABLE_APM', isProduction),
    serviceName: getEnvVar('APM_SERVICE_NAME', 'player-character-service'),
    serverUrl: getEnvVar('APM_SERVER_URL', ''),
  },
};

/**
 * Validates the configuration object.
 * Throws errors if required values are missing or invalid.
 * 
 * @throws {Error} If configuration is invalid
 */
function validateConfig() {
  const errors = [];
  
  // Validate database URI format
  if (!config.database.uri.startsWith('mongodb://') && 
      !config.database.uri.startsWith('mongodb+srv://')) {
    errors.push('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }
  
  // Validate port range
  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }
  
  // Validate log level
  const validLogLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLogLevels.includes(config.logging.level)) {
    errors.push(`LOG_LEVEL must be one of: ${validLogLevels.join(', ')}`);
  }
  
  // Validate CORS in production
  if (isProduction && config.cors.origin === '*') {
    errors.push('CORS_ORIGIN must not be "*" in production');
  }
  
  // Validate rate limiting in production
  if (isProduction && !config.security.rateLimiting.enabled) {
    console.warn('WARNING: Rate limiting is disabled in production');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Logs configuration summary (without sensitive information).
 */
function logConfigSummary() {
  console.log('='.repeat(60));
  console.log('Player Character Service - Configuration Summary');
  console.log('='.repeat(60));
  console.log(`Environment:        ${config.env}`);
  console.log(`Server:             ${config.server.host}:${config.server.port}`);
  console.log(`Database:           ${config.database.uri.replace(/\/\/.*@/, '//***@')}`); // Hide credentials
  console.log(`CORS Origins:       ${Array.isArray(config.cors.origin) ? config.cors.origin.join(', ') : config.cors.origin}`);
  console.log(`Log Level:          ${config.logging.level}`);
  console.log(`Rate Limiting:      ${config.security.rateLimiting.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`Feature Flags:      ${Object.entries(config.features).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'None'}`);
  console.log('='.repeat(60));
}

// Validate configuration at module load
try {
  validateConfig();
  if (!process.env.SUPPRESS_CONFIG_LOG) {
    logConfigSummary();
  }
} catch (error) {
  console.error('Configuration Error:', error.message);
  process.exit(1);
}

export default config;
```

#### src/config/database.config.js
```javascript
/**
 * @fileoverview Database-specific configuration helper.
 * 
 * @module config/database
 */

import config from './index.js';

/**
 * MongoDB connection options based on environment.
 */
export const mongoOptions = {
  // Connection pool
  minPoolSize: config.database.poolMin,
  maxPoolSize: config.database.poolMax,
  
  // Timeouts
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  
  // Compression
  compressors: ['zlib'],
  
  // Write concern (safer in production)
  w: config.isProduction ? 'majority' : 1,
  journal: config.isProduction,
  
  // Read preference
  readPreference: config.isProduction ? 'primaryPreferred' : 'primary',
  
  // Server selection
  serverSelectionTimeoutMS: 5000,
  
  // Monitoring
  monitorCommands: config.isDevelopment,
};

/**
 * Get database name from MongoDB URI.
 * 
 * @returns {string} Database name
 */
export function getDatabaseName() {
  const uri = config.database.uri;
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : 'player_characters';
}

export default {
  uri: config.database.uri,
  options: mongoOptions,
  databaseName: getDatabaseName(),
};
```

#### src/config/server.config.js
```javascript
/**
 * @fileoverview Server-specific configuration helper.
 * 
 * @module config/server
 */

import config from './index.js';

/**
 * Express server middleware configuration.
 */
export const serverConfig = {
  // Body parser settings
  bodyParser: {
    json: {
      limit: config.security.requestSizeLimit,
      strict: true,
    },
    urlencoded: {
      limit: config.security.requestSizeLimit,
      extended: true,
    },
  },
  
  // Compression settings
  compression: {
    threshold: 1024, // Only compress responses > 1KB
    level: config.isProduction ? 6 : 1, // Higher compression in production
  },
  
  // Rate limiting settings
  rateLimit: config.security.rateLimiting.enabled ? {
    windowMs: config.security.rateLimiting.windowMs,
    max: config.security.rateLimiting.maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  } : null,
  
  // Request timeout
  timeout: config.isProduction ? 30000 : 60000, // 30s prod, 60s dev
};

export default serverConfig;
```

### Usage Examples

#### Application Startup (src/index.js)
```javascript
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import serverConfig from './config/server.config.js';
import databaseConfig from './config/database.config.js';

const app = express();

// CORS
app.use(cors(config.cors));

// Compression
app.use(compression(serverConfig.compression));

// Body parsing
app.use(express.json(serverConfig.bodyParser.json));
app.use(express.urlencoded(serverConfig.bodyParser.urlencoded));

// Rate limiting (if enabled)
if (serverConfig.rateLimit) {
  app.use(rateLimit(serverConfig.rateLimit));
}

// Routes
// ... add your routes here

// Start server
app.listen(config.server.port, config.server.host, () => {
  console.log(`Server running on ${config.server.baseUrl}`);
  console.log(`Environment: ${config.env}`);
});
```

#### Database Connection (src/database/connection.js)
```javascript
import { MongoClient } from 'mongodb';
import databaseConfig from '../config/database.config.js';

let client = null;
let db = null;

/**
 * Connect to MongoDB using configuration.
 */
export async function connectDatabase() {
  if (client) {
    return db;
  }
  
  try {
    client = new MongoClient(databaseConfig.uri, databaseConfig.options);
    await client.connect();
    db = client.db(databaseConfig.databaseName);
    console.log(`Connected to MongoDB: ${databaseConfig.databaseName}`);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Close database connection.
 */
export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Disconnected from MongoDB');
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return db;
}
```

#### Feature Flag Usage
```javascript
import config from './config/index.js';

/**
 * Example: Only allow spellcasting if feature is enabled.
 */
function validateCharacter(character) {
  // ... other validation
  
  if (character.spellcasting && !config.features.spellcasting) {
    throw new Error('Spellcasting feature is not enabled');
  }
  
  // ... continue validation
}
```

### Testing Configuration

#### tests/config/config.test.js
```javascript
import config from '../../src/config/index.js';

describe('Configuration', () => {
  it('should load environment correctly', () => {
    expect(config.env).toBeDefined();
    expect(['development', 'staging', 'production']).toContain(config.env);
  });
  
  it('should have valid server configuration', () => {
    expect(config.server.port).toBeGreaterThan(0);
    expect(config.server.port).toBeLessThanOrEqual(65535);
    expect(config.server.host).toBeDefined();
  });
  
  it('should have valid database URI', () => {
    expect(config.database.uri).toMatch(/^mongodb/);
  });
  
  it('should have valid log level', () => {
    const validLevels = ['debug', 'info', 'warn', 'error'];
    expect(validLevels).toContain(config.logging.level);
  });
  
  it('should not allow wildcard CORS in production', () => {
    if (config.isProduction) {
      expect(config.cors.origin).not.toBe('*');
    }
  });
  
  it('should enable rate limiting in production', () => {
    if (config.isProduction) {
      expect(config.security.rateLimiting.enabled).toBe(true);
    }
  });
});
```

### Package Dependencies

#### package.json additions
```json
{
  "dependencies": {
    "dotenv": "^16.3.1"
  }
}
```

## Testing Strategy

### Unit Tests
- Test environment variable parsing (string, int, bool, array)
- Test default value handling
- Test validation logic
- Test error handling for missing required variables

### Integration Tests
- Test configuration loading in different environments
- Test database connection with configuration
- Test server startup with configuration
- Test CORS and security middleware with configuration

### Configuration Tests
- Test .env.example has all documented variables
- Test configuration validation catches errors
- Test sensitive values are not logged
- Test type conversion edge cases

## Success Criteria

- ✅ Configuration loads successfully in all environments
- ✅ All required variables validated at startup
- ✅ .env.example file is complete and up-to-date
- ✅ Secrets never appear in logs or error messages
- ✅ Configuration module is fully typed
- ✅ Environment-specific defaults work correctly
- ✅ Validation catches all configuration errors
- ✅ Documentation covers all configuration options
- ✅ Tests verify configuration behavior
