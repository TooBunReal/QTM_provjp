const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secret = 'your-secret-key';

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                res.status(401).send('Invalid token');
            } else {
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(401).send('No token provided');
    }
};

function convertJWTToJS(accessToken) {
    const tokenParts = accessToken.split(".");
    const header = atob(tokenParts[0]);
    const body = atob(tokenParts[1]);
    const signature = tokenParts[2];

    return {
        header,
        body,
        signature,
    };
}

function verifyJWTWithSecretKey(token, secretKey) {
    // Decode the JWT token.
    const decodedToken = atob(token);

    // Split the JWT token into its parts.
    const tokenParts = decodedToken.split('.');

    // Get the signature algorithm from the header.
    const signatureAlgorithm = tokenParts[0].alg;

    // Verify the signature.
    const signature = tokenParts[2];
    const verified = crypto.verifySign(signatureAlgorithm, secretKey, tokenParts[0] + '.' + tokenParts[1], signature);

    return verified;
}

module.exports = {
    jwtMiddleware,
    convertJWTToJS,
    verifyJWTWithSecretKey,
    sign: jwt.sign,
};