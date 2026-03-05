const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'APP_SECRET'
];

// Optional environment variables with defaults
const optionalEnvVars = {
  PORT: '5000',
  NODE_ENV: 'development',
  FRONTEND_URL: 'http://localhost:3000'
};

// Validate required environment variables
const validateEnv = () => {
  const missingVars = [];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file');
    process.exit(1);
  }

  // Set optional variables with defaults
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      console.log(`⚠️  Using default value for ${key}: ${defaultValue}`);
    }
  });

  // Validate specific formats
  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    console.error('❌ Invalid NODE_ENV. Must be: development, production, or test');
    process.exit(1);
  }

  const port = parseInt(process.env.PORT);
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error('❌ Invalid PORT. Must be a number between 1 and 65535');
    process.exit(1);
  }

  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env file not found. Using environment variables or defaults.');
  }

  console.log('✅ Environment validation passed');
  console.log(`📍 Running in ${process.env.NODE_ENV} mode`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🚀 Server will run on port ${process.env.PORT}`);
};

// Generate secure secrets if not provided
const generateSecrets = () => {
  const crypto = require('crypto');
  
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
    console.log('🔐 Generated JWT_SECRET');
  }
  
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = crypto.randomBytes(64).toString('hex');
    console.log('🔐 Generated JWT_REFRESH_SECRET');
  }
  
  if (!process.env.APP_SECRET) {
    process.env.APP_SECRET = crypto.randomBytes(64).toString('hex');
    console.log('🔐 Generated APP_SECRET');
  }
};

module.exports = {
  validateEnv,
  generateSecrets
};
