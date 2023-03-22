import { config } from "../config/config.js";
import bcrypt from 'bcrypt';

export const csrfCheck = (req, res, next) => {
    if (
        req.method === 'GET' ||
        req.method === 'OPTIONS' ||
        req.method === 'HEAD'
    ) {
        return next();
    }

    const csrfHeader = req.get('jwitter-csrf-token');

    if (!csrfHeader) {
        console.warn('Missing required "jwitter-csrf-token" header.', req.headers.origin);
        return res.status(403).json({ message: 'Failed CSRF check' });
    }

    validateCSRFToken(csrfHeader)
        .then((valid) => {
            if (!valid) {
                console.warn(
                    'Value provided in "jwitter-csrf-token" header does not validate.',
                    req.headers.origin,
                    csrfHeader,
                );
                return res.status(403).json({ message: 'Failed CSRF check' });
            }
            next();
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: 'Something went wrong!' });
        });
};

async function validateCSRFToken(csrfHeader) {
    return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}