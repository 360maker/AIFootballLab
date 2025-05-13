export const CLIENT_ID = "5b2ktqs9naet7g4q3bh5u5hk82";
export const REDIRECT_URI = `${window.location.origin}/callback`;
export const LOGOUT_URI = `${window.location.origin}`;
export const REGION = "eu-north-1";
export const DOMAIN = "aifootballlab-demo.auth.eu-north-1.amazoncognito.com";

export class AuthManager {
  static getAccessToken(): string | null {
    return sessionStorage.getItem("access_token");
  }

  static getIdToken(): string | null {
    return sessionStorage.getItem("id_token");
  }

  static getUserEmail(): string | null {
    return sessionStorage.getItem("user_email");
  }

  static isAuthenticated(): boolean {
    return !!this.getIdToken();
  }

  static login(): void {
    const loginUrl = `https://${DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=email+openid+profile`;
    window.location.href = loginUrl;
  }

  static logout(): void {
    sessionStorage.clear();
    const logoutUrl = `https://${DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
    window.location.href = logoutUrl;
  }

  static async handleCallback(): Promise<void> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) throw new Error("Codice di autorizzazione mancante");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
    });

    const response = await fetch(`https://${DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) throw new Error("Errore nel recupero del token");

    const data = await response.json();

    // ✅ Salvataggio token
    sessionStorage.setItem("access_token", data.access_token);
    sessionStorage.setItem("id_token", data.id_token);

    // ✅ Estrazione dati dal token
    const payload = JSON.parse(atob(data.id_token.split(".")[1]));
    const email = payload.email;
    const issuer = payload.iss;

    console.log("✅ Token issuer:", issuer);
    console.log("👤 Email utente:", email);

    if (email) sessionStorage.setItem("user_email", email);

    // 🔁 Nessun redirect qui, lo gestisce il componente Callback.tsx
  }
}
