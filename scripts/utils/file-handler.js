// Fungsi untuk menangani upload file Excel
class FileHandler {
    constructor() {
        this.rawData = [];
    }

    async handleFileUpload(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Process workbook
                    const result = this.processWorkbook(workbook);
                    this.rawData = result;
                    
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    processWorkbook(workbook) {
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        if (jsonData.length < 2) {
            throw new Error('File Excel tidak berisi data yang cukup');
        }

        const headers = this.normalizeHeaders(jsonData[0]);
        const rows = jsonData.slice(1);
        
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });
    }

    normalizeHeaders(headers) {
        // Implementasi normalisasi header
        const headerMap = {
            // Mapping seperti di data-processor.js
        };
        
        return headers.map(header => {
            const normalized = header.toString().toLowerCase().trim();
            return headerMap[normalized] || header;
        });
    }
}

export default FileHandler;
