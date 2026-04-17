import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RemissionService, Remission } from '../../core/remission.service';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-remissions-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, TableModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule, TagModule, TooltipModule
  ],
  templateUrl: './remissions-list.component.html'
})
export class RemissionsListComponent {
  private remissionService = inject(RemissionService);
  private messageService = inject(MessageService);

  remissions = signal<Remission[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);
  rows = signal<number>(10);
  searchTerm = signal<string>('');

  loadRemissions(event: TableLazyLoadEvent) {
    this.loading.set(true);
    const page = (event.first || 0) / (event.rows || 10) + 1;
    const limit = event.rows || 10;
    const search = this.searchTerm();

    this.remissionService.getRemissions(page, limit, search).subscribe({
      next: (response) => {
        this.remissions.set(response.remissions);
        this.totalRecords.set(response.pagination.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.loadRemissions({ first: 0, rows: this.rows() });
  }

  downloadPDF(id: string) {
    this.remissionService.downloadPDF(id);
    this.messageService.add({ severity: 'info', summary: 'Descarga', detail: 'Iniciando descarga de PDF...' });
    // Pequeño delay para recargar el estado pdfGenerated
    setTimeout(() => {
        const first = 0; // Podríamos guardar el estado actual si fuera necesario
        this.loadRemissions({ first, rows: this.rows() });
    }, 2000);
  }

  deleteRemission(id: string) {
    if (confirm('¿Está seguro de eliminar esta remisión? Esta acción no se puede deshacer.')) {
      this.remissionService.deleteRemission(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Remisión eliminada correctamente' });
          this.loadRemissions({ first: 0, rows: this.rows() });
        }
      });
    }
  }

  annulRemission(id: string) {
    if (confirm('¿Está seguro de anular esta remisión? Aparecerá como ANULADA en el sistema y en el PDF.')) {
      this.remissionService.annulRemission(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Remisión anulada correctamente' });
          this.loadRemissions({ first: 0, rows: this.rows() });
        }
      });
    }
  }
}
