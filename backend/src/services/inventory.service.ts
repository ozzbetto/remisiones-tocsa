export interface InventoryAsset {
  id: string;
  description: string;
  brand: string;
  model: string;
  serial: string;
}

export class InventoryService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private get config() {
    const clientId = process.env.INVGATE_CLIENT_ID || '';
    const clientSecret = process.env.INVGATE_CLIENT_SECRET || '';
    
    if (!clientId || !clientSecret) {
      console.warn('⚠️ Advertencia: INVGATE_CLIENT_ID o INVGATE_CLIENT_SECRET no están definidos en el entorno.');
    }

    return {
      apiUrl: 'https://tocsa.is.cloud.invgate.net/public-api',
      clientId,
      clientSecret
    };
  }

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiry - 30000) {
      return this.accessToken;
    }

    const { clientId, clientSecret } = this.config;
    
    if (!clientId || !clientSecret) {
      console.error('❌ Error: No se pueden obtener las credenciales de InvGate del entorno.');
      return null;
    }

    const authUrl = 'https://tocsa.is.cloud.invgate.net/oauth2/token/';
    console.log(`🔑 Intentando autenticación en InvGate... (Client ID: ${clientId.substring(0, 5)}...)`);

    try {
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (response.ok) {
        const data = await response.json() as any;
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);
        console.log('✅ Token de InvGate obtenido exitosamente.');
        return this.accessToken;
      }
      
      const errorText = await response.text();
      console.error(`❌ Error de autenticación en InvGate ${response.status}: ${errorText}`);
    } catch (err: any) {
      console.error(`⚠️ Error de red al conectar con InvGate: ${err.message}`);
    }

    return null;
  }

  async searchComputers(query: string = ''): Promise<InventoryAsset[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    const { apiUrl } = this.config;

    try {
      const url = new URL(`${apiUrl}/v2/assets-lite/`);
      if (query) {
        url.searchParams.append('keyword', query);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*' 
        }
      });

      if (!response.ok) {
        throw new Error(`InvGate API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      const items = Array.isArray(data.results) ? data.results : 
                    Array.isArray(data.data) ? data.data : 
                    Array.isArray(data) ? data : [];

      return items.map((item: any) => {
        return {
          id: item.id?.toString() || '',
          description: item.name || 'Sin nombre',
          brand: item.manufacturer || 'Desconocida',
          model: item.model || 'Equipo InvGate',
          serial: item.serial || 'S/N'
        };
      });
    } catch (error) {
      console.error('Error in searchComputers:', error);
      return [];
    }
  }
}

export const inventoryService = new InventoryService();
