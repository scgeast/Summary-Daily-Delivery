// Konfigurasi chart untuk tab logistik
class LogisticsCharts {
    constructor() {
        this.charts = {};
    }

    createVolumePerAreaChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        this.charts.volumePerArea = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Volume (m³) per Area',
                    data: Object.values(data),
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                }]
            },
            options: this.getDefaultOptions()
        });
    }

    createVolumePerPlantChart(canvasId, data) {
        // Implementasi chart volume per plant
    }

    getDefaultOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Volume (m³)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Area'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Volume: ${context.raw} m³`;
                        }
                    }
                }
            }
        };
    }

    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

export default LogisticsCharts;
