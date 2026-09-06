import { OAuth2Client } from "google-auth-library";

/**
 * GoogleAuthService — verifye yon idToken Google Sign-In voye soti nan app Android la.
 *
 * PWEPARASYON POU ITILIZE:
 * 1. Kreye yon pwojè sou Google Cloud Console (console.cloud.google.com)
 * 2. Aktive "Google Sign-In API" epi kreye yon OAuth Client ID pou Android
 *    (mande package name "com.cheryai.assistant" ak SHA-1 siyati aplikasyon an)
 * 3. Kreye tou yon Client ID "Web application" — se SA a ki sèvi pou VERIFYE
 *    token yo sou backend la (pa Client ID Android la)
 * 4. Mete Web Client ID a nan .env kòm GOOGLE_CLIENT_ID
 * 5. Nan app Android la, konfigire GoogleSignInOptions ak Web Client ID a tou
 *    (requestIdToken(webClientId)) — se konsa idToken ki jenere a ap valid pou backend la
 */
export class GoogleAuthService {
  private client: OAuth2Client | null = null;

  private getClient(): OAuth2Client {
    if (!this.client) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error("GOOGLE_CLIENT_ID pa konfigire nan .env — gade TODO.md pou etap konfigirasyon Google Cloud");
      }
      this.client = new OAuth2Client(clientId);
    }
    return this.client;
  }

  /**
   * Verifye idToken lan epi retounen enfo debaz itilizatè Google la (imèl, non).
   * Voye yon erè si token la envalid oswa ekspire.
   */
  async verifyIdToken(idToken: string): Promise<{ email: string; name: string }> {
    const client = this.getClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Token Google la pa gen enfo itilizatè valid");
    }

    return { email: payload.email, name: payload.name || payload.email.split("@")[0] };
  }
}

export const googleAuthService = new GoogleAuthService();
