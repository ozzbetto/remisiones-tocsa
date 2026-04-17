import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  description: string;
  brand: string;
  model: string;
  serial: string;
  quantity: number;
  condition: 'nuevo' | 'usado' | 'reparado' | 'dañado';
  observation?: string;
  cost?: number;
  requiresResponsibilityTerm?: boolean;
}

export interface Remission {
  _id?: string;
  remissionNumber?: string;
  date: Date;
  sender?: {
    name: string;
    ruc: string;
    address: string;
  };
  recipient: {
    name: string;
    idNumber: string;
    positionArea: string;
    location: string;
  };
  items: Item[];
  transferReason: 'traslado interno' | 'reparación' | 'transformación' | 'exhibición' | 'otros';
  observations?: string;
  authorizedBy: string;
  receivedBy: string;
  createdAt?: string;
  pdfGenerated?: boolean;
  status?: 'active' | 'annulled';
}

export interface RemissionResponse {
  remissions: Remission[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RemissionService {
  private http = inject(HttpClient);
  private apiUrl = '/api/remissions';

  getRemissions(page: number = 1, limit: number = 10, search?: string): Observable<RemissionResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    
    return this.http.get<RemissionResponse>(this.apiUrl, { params });
  }

  getRemissionById(id: string): Observable<Remission> {
    return this.http.get<Remission>(`${this.apiUrl}/${id}`);
  }

  createRemission(remission: Remission): Observable<Remission> {
    return this.http.post<Remission>(this.apiUrl, remission);
  }

  updateRemission(id: string, remission: Partial<Remission>): Observable<Remission> {
    return this.http.put<Remission>(`${this.apiUrl}/${id}`, remission);
  }

  deleteRemission(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  annulRemission(id: string): Observable<Remission> {
    return this.http.patch<Remission>(`${this.apiUrl}/${id}/annul`, {});
  }

  downloadPDF(id: string) {
    window.open(`${this.apiUrl}/${id}/pdf`, '_blank');
  }
}
