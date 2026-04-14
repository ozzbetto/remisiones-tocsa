import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventoryAsset {
  id: string;
  description: string;
  brand: string;
  model: string;
  serial: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = '/api/inventory';

  searchAssets(query: string): Observable<InventoryAsset[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<InventoryAsset[]>(`${this.apiUrl}/search`, { params });
  }
}
