import { useEffect, useState } from "react";

export default function BiometricAuth() {
  const [authStatus, setAuthStatus] = useState<string>("Please login...");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setAuthStatus("Logging in with username and password...");
      setTimeout(() => {
        setAuthStatus("Login successful!");
      }, 2000);
    } else {
      setAuthStatus("Please enter both username and password.");
    }
  };

  const handleBiometricAuth = async () => {
    if (!window.PublicKeyCredential) {
      setAuthStatus("WebAuthn is not supported on this device/browser.");
      return;
    }

    setAuthStatus("Authenticating with biometrics...");
    try {
      const challenge = new Uint8Array([
        0x8c, 0x56, 0x7c, 0x2e, 0xa1, 0x5f, 0x16, 0x28,
      ]);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge: challenge,
          rp: { id: "mhrastegari.github.io", name: "MHR Auth" },
          user: {
            id: new Uint8Array([
              0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            ]),
            name: "user@example.com",
            displayName: "Example User",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -8 },
            { type: "public-key", alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            residentKey: "preferred",
            userVerification: "preferred",
          },
          timeout: 60000,
          attestation: "direct",
          extensions: {
            credProps: true,
          },
        };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      if (credential) {
        setAuthStatus("Biometric authentication successful!");
      } else {
        setAuthStatus("Authentication canceled or failed.");
      }
    } catch (error) {
      setAuthStatus(`Error: ${error}`);
    }
  };

  const checkBiometricSupport = () => {
    if (navigator.credentials && window.PublicKeyCredential) {
      setIsBiometricEnabled(true);
    }
  };

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {isBiometricEnabled && (
        <div>
          <button onClick={handleBiometricAuth}>Login with Biometrics</button>
        </div>
      )}

      <h3>Status:</h3>
      <p>{authStatus}</p>
    </div>
  );
}
