import { CONFIG } from '../config';

/**
 * Stub for integrating with a third-party verification provider (e.g., Persona, Yoti).
 * Now using Web Authentication API (WebAuthn) for biometric verification where supported.
 */
export const VerificationService = {
  /**
   * Starts the verification flow.
   * In a real app, this would open a webview or native SDK for the provider.
   */
  startVerificationFlow: async (userId: string): Promise<'VERIFIED' | 'FAILED_UNCERTAIN' | 'FAILED_UNDERAGE' | 'CANCELLED'> => {
    try {
      // Check if WebAuthn is supported
      if (window.PublicKeyCredential) {
        // This is a simplified WebAuthn flow for demonstration.
        // In a real app, you would fetch challenge options from your server.
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        try {
          // Attempt to use platform authenticator (FaceID/TouchID/Windows Hello)
          await navigator.credentials.create({
            publicKey: {
              challenge,
              rp: { name: "Thurzt", id: window.location.hostname },
              user: {
                id: new Uint8Array(16),
                name: userId,
                displayName: "Thurzt User"
              },
              pubKeyCredParams: [{ type: "public-key", alg: -7 }],
              authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required"
              },
              timeout: 60000
            }
          });
          return 'VERIFIED';
        } catch (e: any) {
          if (e.name === 'NotAllowedError') {
            // console.log("Authentication cancelled by user.");
            return 'CANCELLED';
          }
          console.warn("Biometric authentication failed or not enrolled. Falling back.", e);
        }
      } else {
        console.warn("WebAuthn not supported. Falling back to mock verification.");
      }

      // Fallback for devices without biometrics
      await new Promise(resolve => setTimeout(resolve, 1500));
      return 'VERIFIED';

    } catch (error) {
      console.error("Error during biometric verification:", error);
      return 'FAILED_UNCERTAIN';
    }
  }
};
