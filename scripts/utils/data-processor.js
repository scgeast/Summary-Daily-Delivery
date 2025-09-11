// Fungsi untuk memproses data mentah menjadi format yang siap digunakan
class DataProcessor {
    constructor(rawData) {
        this.rawData = rawData;
        this.processedData = [];
    }

    // Normalisasi header untuk konsistensi
    normalizeHeaders(headers) {
        const headerMap = {
            'dp no': 'DP No',
            'trip': 'DP No',
            'ritase': 'DP No',
            'dp date': 'DP Date',
            'delivery date': 'DP Date',
            'area': 'Area',
            'region': 'Area',
            'plant name': 'Plant Name',
            'plant': 'Plant Name',
            'qty': 'QTY',
            'volume': 'QTY',
            'end customer name': 'End Customer Name',
            'customer': 'End Customer Name',
            'truck no': 'Truck No',
            'tm': 'Truck No',
            'truck': 'Truck No',
            'sales man': 'Sales Man',
            'sales': 'Sales Man',
            'distance': 'Distance'
        };

        return headers.map(header => {
            const normalized = header.toString().toLowerCase().trim().replace(/\s+/g, ' ');
            return headerMap[normalized] || header;
        });
    }

    // Process data untuk chart
    processForCharts() {
        // Implementasi processing data untuk berbagai chart
        return {
            volumePerArea: this.calculateVolumePerArea(),
            volumePerPlant: this.calculateVolumePerPlant(),
            // ... lainnya
        };
    }

    calculateVolumePerArea() {
        // Logika perhitungan volume per area
        const result = {};
        this.rawData.forEach(item => {
            const area = item.Area || 'Unknown';
            if (!result[area]) {
                result[area] = 0;
            }
            result[area] += Number(item.QTY) || 0;
        });
        return result;
    }

    // ... methods lainnya
}

export default DataProcessor;
