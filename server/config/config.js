import dotenv from 'dotenv';

dotenv.config();

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;

    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}

export const config = {
    host: {
        port: parseInt(required('HOST_PORT', 8080)),
    },
    jwt: {
        secretKey: required('JWT_SECRET'),
        expiresInSec: parseInt(required('JWT_EXPIRES_SEC')),
    },
    bcrypt: {
        saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS')),
    },
    db: {
        host: required('MONGO_HOST'),
    },
    cors: {
        allowedOrigin: required('CORS_ALLOW_ORIGIN'),
    },
    csrf: {
        plainToken: required('CSRF_SECRET_KEY'),
    },
    rateLimit: {
        windowMs: parseInt(required('WINDOW_MS')),
        maxRequest: parseInt(required('MAX_REQUEST')),
    },
};