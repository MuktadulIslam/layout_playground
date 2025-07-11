import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { downloadAPIConfig as config, oauth } from '@/components/canvas/sketchfab/config';
import { setAccessToken, setRefreshToken } from '@/components/canvas/sketchfab/utils/authToken';

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const code: string | null = searchParams.get('code');
    const state: string | null = searchParams.get('state');
    const storedState: string | undefined = request.cookies.get(oauth.state)?.value;

    console.log('Authorization callback received:', { code: !!code, state, storedState });

    // Verify state parameter for security (only if we have stored state)
    if (storedState && state !== storedState) {
        console.error('State mismatch:', { received: state, stored: storedState });
        return new NextResponse(`
            <html>
                <body>
                    <script>
                        window.opener?.postMessage({ 
                            type: 'AUTH_ERROR', 
                            error: 'invalid_state',
                            message: 'Authentication failed due to invalid state' 
                        }, '*');
                        window.close();
                    </script>
                </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' },
            status: 400
        });
    }

    if (!code) {
        console.error('No authorization code received');
        return new NextResponse(`
            <html>
                <body>
                    <script>
                        window.opener?.postMessage({ 
                            type: 'AUTH_ERROR', 
                            error: 'no_code',
                            message: 'No authorization code received' 
                        }, '*');
                        window.close();
                    </script>
                </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' },
            status: 400
        });
    }

    try {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'authorization_code');
        formData.append('client_id', config.clientId);
        formData.append('client_secret', config.clientSecret);
        formData.append('redirect_uri', config.redirectUri);
        formData.append('code', code);

        const tokenResponse = await axios({
            method: 'POST',
            url: `${config.oauthBaseUrl}/token/`,
            data: formData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 10000, // 10 second timeout
        });

        console.log('Token response received:', {
            status: tokenResponse.status,
            hasAccessToken: !!tokenResponse.data.access_token,
            hasRefreshToken: !!tokenResponse.data.refresh_token
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        console.log({ access_token, refresh_token, expires_in });

        if (!access_token) {
            console.error('No access token in response:', tokenResponse.data);
            return new NextResponse(`
                <html>
                    <body>
                        <script>
                            window.opener?.postMessage({ 
                                type: 'AUTH_ERROR', 
                                error: 'no_access_token',
                                message: 'No access token received' 
                            }, '*');
                            window.close();
                        </script>
                    </body>
                </html>
            `, {
                headers: { 'Content-Type': 'text/html' },
                status: 400
            });
        }

        const response = new NextResponse(`
            <html>
                <body>
                    <script>
                        window.opener?.postMessage({ 
                            type: 'AUTH_SUCCESS', 
                            access_token: '${access_token}',
                            refresh_token: '${refresh_token || ''}',
                            expires_in: ${expires_in || 3600}
                        }, '*');
                        window.close();
                    </script>
                </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });

        setAccessToken(access_token, response, expires_in);
        if (refresh_token) setRefreshToken(refresh_token, response, expires_in);
        response.cookies.delete(oauth.state);
        // response.cookies.set('sketchfab_access_token', access_token, {
        //     httpOnly: true,
        //     path: '/',
        //     maxAge: expires_in || 2592000, // Use expires_in from response or default to 30 days
        //     sameSite: 'lax', // Changed from 'strict' to 'lax' for OAuth compatibility
        //     secure: process.env.NODE_ENV === 'production'
        // });
        // console.log('Authentication successful, closing popup');
        return response;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('OAuth callback error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
            const errorMessage: string = error.response?.data?.error || 'auth_failed';
            return new NextResponse(`
                <html>
                    <body>
                        <script>
                            window.opener?.postMessage({ 
                                type: 'AUTH_ERROR', 
                                error: '${errorMessage}',
                                message: 'Authentication failed' 
                            }, '*');
                            window.close();
                        </script>
                    </body>
                </html>
            `, {
                headers: { 'Content-Type': 'text/html' },
                status: 400
            });
        } else {
            // Handle non-Axios errors
            console.error('Unexpected error:', error);
            return new NextResponse(`
                <html>
                    <body>
                        <script>
                            window.opener?.postMessage({ 
                                type: 'AUTH_ERROR', 
                                error: 'unexpected_error',
                                message: 'An unexpected error occurred' 
                            }, '*');
                            window.close();
                        </script>
                    </body>
                </html>
            `, {
                headers: { 'Content-Type': 'text/html' },
                status: 500
            });
        }
    }
}