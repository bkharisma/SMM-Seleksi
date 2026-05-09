import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Badge from '@/components/ui/badge';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileKesehatan {
    id: number;
    file_lockes: string;
    is_revisi: boolean;
}

export default function PDFPreview({ file }: { file: FileKesehatan }) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const pdfUrl = `/storage/${file.file_lockes}`;

    useEffect(() => {
        setNumPages(null);
        setError(null);
    }, [file]);

    return (
        <div className="flex flex-col items-center">
            <div className="mb-2 text-sm text-gray-600">
                File: {file.file_lockes.split('/').pop()}
                {file.is_revisi && <Badge variant="warning" className="ml-2">Revisi</Badge>}
            </div>
            <div className="w-full overflow-auto rounded border bg-gray-50" style={{ maxHeight: '80vh' }}>
                <Document
                    key={file.id}
                    file={pdfUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    onLoadError={() => setError('Gagal memuat PDF')}
                    loading={
                        <div className="flex h-64 items-center justify-center text-gray-500">
                            Memuat PDF...
                        </div>
                    }
                >
                    {error ? (
                        <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                            <p>Gagal memuat PDF</p>
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-sm text-blue-600 hover:underline"
                            >
                                Buka di tab baru
                            </a>
                        </div>
                    ) : (
                        Array.from(new Array(numPages || 0), (_, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={800}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="mb-2"
                            />
                        ))
                    )}
                </Document>
            </div>
        </div>
    );
}
