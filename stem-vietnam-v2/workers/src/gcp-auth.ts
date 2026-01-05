// Chú thích: Google OAuth2 helper cho Cloudflare Workers
// Tạo access token từ service account credentials

export interface VertexAICredentials {
    clientEmail: string;
    privateKey: string;
    privateKeyId?: string;
    projectId: string;
    location: string;
}

// Chú thích: Base64URL encode
function base64UrlEncode(data: string): string {
    const base64 = btoa(data);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Chú thích: Import private key cho Web Crypto API
async function importPrivateKey(pem: string): Promise<CryptoKey> {
    // Chú thích: Handle escaped newlines từ environment variable
    const normalizedPem = pem.replace(/\\n/g, '\n');

    // Chú thích: Remove PEM header/footer và whitespace
    const pemContents = normalizedPem
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\s/g, '');

    // Chú thích: Decode base64
    const binaryString = atob(pemContents);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Chú thích: Import key for RS256 signing
    return await crypto.subtle.importKey(
        'pkcs8',
        bytes.buffer,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        false,
        ['sign']
    );
}

// Chú thích: Sign data với private key
async function signData(data: string, privateKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        privateKey,
        encoder.encode(data)
    );

    // Chú thích: Convert ArrayBuffer to base64url string
    const bytes = new Uint8Array(signature);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return base64UrlEncode(binary);
}

// Chú thích: Tạo JWT token
async function createJWT(credentials: VertexAICredentials): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // 1 hour

    const header = {
        alg: 'RS256',
        typ: 'JWT',
        ...(credentials.privateKeyId && { kid: credentials.privateKeyId }),
    };

    const payload = {
        iss: credentials.clientEmail,
        sub: credentials.clientEmail,
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: expiry,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
    };

    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${headerB64}.${payloadB64}`;

    const privateKey = await importPrivateKey(credentials.privateKey);
    const signature = await signData(unsignedToken, privateKey);

    return `${unsignedToken}.${signature}`;
}

// Chú thích: Exchange JWT for access token
export async function getAccessToken(credentials: VertexAICredentials): Promise<string> {
    const jwt = await createJWT(credentials);

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get access token: ${error}`);
    }

    const data = await response.json() as { access_token: string };
    return data.access_token;
}
