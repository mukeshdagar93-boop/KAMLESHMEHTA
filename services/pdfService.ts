// Since pdf-lib is loaded from a CDN, it's not a module.
// We need to declare its global existence for TypeScript.
declare const PDFLib: {
  PDFDocument: {
    create: () => Promise<any>;
    // FIX: Update PDFDocument.load to accept an options object to match the pdf-lib API and fix the type error.
    load: (data: ArrayBuffer, options?: { ignoreEncryption: boolean }) => Promise<any>;
  };
};

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  if (!PDFLib) {
    throw new Error("PDF-Lib is not loaded. Please check your internet connection and script tags.");
  }
  const { PDFDocument } = PDFLib;
  const mergedPdf = await PDFDocument.create();

  // Sort files by name to ensure consistent order if not manually reordered
  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

  for (const file of sortedFiles) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const pdf = await PDFDocument.load(arrayBuffer, { 
        // Ignore errors for potentially corrupted PDFs, allowing the merge to continue
        ignoreEncryption: true,
      });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page: any) => {
        mergedPdf.addPage(page);
      });
    } catch (err) {
      console.error(`Failed to load or process file: ${file.name}`, err);
      throw new Error(`Could not process '${file.name}'. It might be a corrupted or encrypted PDF.`);
    }
  }

  return await mergedPdf.save();
};