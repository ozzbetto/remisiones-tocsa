import { Remission } from '../models/Remission.js';
import { RemissionInput } from './remission.schema.js';

export class RemissionService {
  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [remissions, total] = await Promise.all([
      Remission.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Remission.countDocuments()
    ]);

    return {
      remissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getById(id: string) {
    const remission = await Remission.findById(id);
    if (!remission) throw new Error('Remisión no encontrada');
    return remission;
  }

  async create(data: RemissionInput) {
    const newRemission = new Remission(data);
    return await newRemission.save();
  }

  async update(id: string, data: Partial<RemissionInput>) {
    const existingRemission = await this.getById(id);
    
    if (existingRemission.status === 'annulled') {
      throw new Error('No se puede modificar una remisión anulada');
    }
    
    if (existingRemission.pdfGenerated) {
      throw new Error('No se puede modificar una remisión que ya tiene el PDF generado');
    }

    return await Remission.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    const existingRemission = await this.getById(id);
    
    if (existingRemission.pdfGenerated) {
      throw new Error('No se puede eliminar una remisión que ya tiene el PDF generado. Debe anularla.');
    }

    return await Remission.findByIdAndDelete(id);
  }

  async annul(id: string) {
    const existingRemission = await this.getById(id);

    if (!existingRemission.pdfGenerated) {
      throw new Error('Solo se pueden anular remisiones que ya tienen el PDF generado. Si no tiene PDF, puede eliminarla.');
    }

    if (existingRemission.status === 'annulled') {
      throw new Error('La remisión ya se encuentra anulada');
    }

    existingRemission.status = 'annulled';
    return await existingRemission.save();
  }

  async markAsPdfGenerated(id: string) {
    const remission = await this.getById(id);
    if (!remission.pdfGenerated) {
      remission.pdfGenerated = true;
      await remission.save();
    }
    return remission;
  }
}

export const remissionService = new RemissionService();
