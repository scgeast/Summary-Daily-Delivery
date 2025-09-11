// File utama yang mengkoordinasi seluruh aplikasi
import FileHandler from './utils/file-handler.js';
import DataProcessor from './utils/data-processor.js';
import LogisticsCharts from './charts/logistics-charts.js';
import SalesCharts from './charts/sales-charts.js';
import SidebarManager from './components/sidebar.js';
import TabManager from './components/tabs.js';

class DeliveryDashboard {
    constructor() {
        this.fileHandler = new FileHandler();
        this.dataProcessor = null;
        this.logisticsCharts = new LogisticsCharts();
        this.salesCharts = new SalesCharts();
        this.sidebarManager = new SidebarManager();
        this.tabManager = new TabManager();
        
        this.rawData = [];
        this.filteredData = [];
        
        this.initializeEventListeners();
        this.initializeWithSampleData();
    }

    initializeEventListeners() {
        // Event listener untuk file upload
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // Event listener untuk filter
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.applyFilters();
        });

        // Drag and drop untuk file upload
        const dropZone = document.getElementById('dropZone');
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                this.handleFileUpload(e.dataTransfer.files[0]);
            }
        });
    }

    async handleFileUpload(file) {
        try {
            this.showLoading();
            this.rawData = await this.fileHandler.handleFileUpload(file);
            this.dataProcessor = new DataProcessor(this.rawData);
            this.applyFilters();
            this.hideLoading();
        } catch (error) {
            console.error('Error processing file:', error);
            this.showError('Error processing file: ' + error.message);
            this.hideLoading();
        }
    }

    applyFilters() {
        // Implementasi filter
        const filters = this.sidebarManager.getCurrentFilters();
        this.filteredData = this.dataProcessor.applyFilters(this.rawData, filters);
        this.updateDashboard();
    }

    updateDashboard() {
        // Update KPI cards
        this.updateKPICards();

        // Update charts
        const chartData = this.dataProcessor.processForCharts(this.filteredData);
        this.logisticsCharts.updateCharts(chartData);
        this.salesCharts.updateCharts(chartData);

        // Update data table
        this.updateDataTable();
    }

    updateKPICards() {
        // Implementasi update KPI cards
        const kpiData = this.dataProcessor.calculateKPIs(this.filteredData);
        
        document.getElementById('totalArea').textContent = kpiData.totalArea;
        document.getElementById('totalPlant').textContent = kpiData.totalPlant;
        document.getElementById('totalVolume').textContent = `${kpiData.totalVolume} m³`;
        document.getElementById('avgVolume').textContent = `${kpiData.avgVolume} m³`;
        document.getElementById('totalTruck').textContent = kpiData.totalTruck;
        document.getElementById('avgLoad').textContent = kpiData.avgLoad;
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showError(message) {
        // Implementasi menampilkan error message
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    initializeWithSampleData() {
        // Load sample data jika tidak ada file yang diupload
        fetch('./assets/data/sample-data.json')
            .then(response => response.json())
            .then(data => {
                this.rawData = data;
                this.dataProcessor = new DataProcessor(this.rawData);
                this.applyFilters();
            })
            .catch(error => {
                console.error('Error loading sample data:', error);
            });
    }
}

// Initialize aplikasi ketika DOM sudah loaded
document.addEventListener('DOMContentLoaded', () => {
    new DeliveryDashboard();
});
