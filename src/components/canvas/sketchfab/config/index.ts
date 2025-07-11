export const downloadAPIConfig = {
    clientId: 'EZOYZZxRpZ8WzgbVbVMI9258h4Gyp8nuMSJfZckw',
    clientSecret: 'FW08AMjyF66B5htjM1wKkeX6s3Et0BYl3NwEs55Up4ODpq31AMFsDNr5K7VCjGwxZ7EzcFRJ67Zxu50tiblF8UA7XAeH25pLYkmuF4t7CZRmSLqtpoyf7bTwaw2YeyJj',
    redirectUri: 'https://localhost:3000/api/sketchfab/authorization',
    apiBaseUrl: 'https://api.sketchfab.com/v3',
    oauthBaseUrl: 'https://sketchfab.com/oauth2'
};
export const oauth = {
    state: 'sketchfab-oauth-state',
    return_url: "sketchfab-oauth-return-url"
}
export const sketchfabToken = {
    accessToken: "sketchfab-download-access-token",
    refreshToken: "sketchfab-download-refresh-token",
}
export const sketchfabTokenMaxAge = 864000 // 10 days in second 