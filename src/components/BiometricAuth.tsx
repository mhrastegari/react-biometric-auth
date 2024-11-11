import { useEffect, useState } from "react";

export default function BiometricAuth() {
  const [authStatus, setAuthStatus] = useState<string>("Initializing...");

  useEffect(() => {
    async function authenticate() {
      if (!window.PublicKeyCredential) {
        setAuthStatus("WebAuthn is not supported on this device/browser.");
        return;
      }

      try {
        const challenge = new Uint8Array([
          0x8c, 0x56, 0x7c, 0x2e, 0xa1, 0x5f, 0x16, 0x28,
        ]);

        const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
          {
            challenge: challenge,
            rp: { name: "test" },
            user: {
              id: new Uint8Array([
                0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
              ]),
              name: "user@example.com",
              displayName: "MH",
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" },
              { alg: -8, type: "public-key" },
              { alg: -257, type: "public-key" },
            ],
            authenticatorSelection: {
              userVerification: "discouraged",
            },
            timeout: 60000,
            attestation: "none",
          };

        const credential = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        });

        if (credential) {
          setAuthStatus("Biometric authentication successful!");
        } else {
          setAuthStatus("Authentication canceled or not completed.");
        }
      } catch (error) {
        setAuthStatus(`Error: ${error}`);
      }
    }

    authenticate();
  }, []);

  return (
    <div>
      <h2>Authentication Status:</h2>
      <p>{authStatus}</p>
    </div>
  );
}
