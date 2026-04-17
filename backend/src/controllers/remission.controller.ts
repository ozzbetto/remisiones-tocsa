import { Request, Response, NextFunction } from 'express';
import { remissionService } from '../services/remission.service.js';
import { remissionSchema } from '../services/remission.schema.js';
import { generateRemissionPDF } from '../services/pdf.service.js';

export const getRemissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const result = await remissionService.getAll(page, limit, search);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getRemissionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const remission = await remissionService.getById(req.params.id);
    res.json(remission);
  } catch (error) {
    next(error);
  }
};

export const createRemission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = remissionSchema.parse(req.body);
    const savedRemission = await remissionService.create(validatedData);
    res.status(201).json(savedRemission);
  } catch (error) {
    next(error);
  }
};

export const updateRemission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = remissionSchema.partial().parse(req.body);
    const updatedRemission = await remissionService.update(req.params.id, validatedData);
    res.json(updatedRemission);
  } catch (error) {
    next(error);
  }
};

export const deleteRemission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await remissionService.delete(req.params.id);
    res.json({ message: 'Remisión eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};

export const annulRemission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedRemission = await remissionService.annul(req.params.id);
    res.json(updatedRemission);
  } catch (error) {
    next(error);
  }
};

export const downloadRemissionPDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const remission = await remissionService.getById(req.params.id);
    const docDefinition = generateRemissionPDF(remission);
    
    const PdfPrinter = (await import('pdfmake')).default;
    const fonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Remision-${remission.remissionNumber}.pdf`);

    pdfDoc.pipe(res);
    pdfDoc.end();

    await remissionService.markAsPdfGenerated(req.params.id);
  } catch (error) {
    next(error);
  }
};
