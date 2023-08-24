const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400; //px
const height = 400; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height});

(async () => {
    const configuration = {
        type: 'bar',
        data: {
            labels: ['高橋', '春日', '本田'],
            datasets: [
                {
                    label: 'Practitioner',
                    data: [0, 1, 1],
                    backgroundColor: 'rgba(102, 102, 102, 0.6)',
                    borderColor: 'rgba(102, 102, 102, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Associate',
                    data: [3, 2, 1],
                    backgroundColor: 'rgba(0, 153, 204, 0.6)',
                    borderColor: 'rgba(0, 153, 204, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Professional',
                    data: [2, 2, 1],
                    backgroundColor: 'rgba(255, 153, 0, 0.6)',
                    borderColor: 'rgba(255, 153, 0, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Speciality',
                    data: [1, 1, 0],
                    backgroundColor: 'rgba(153, 0, 255, 0.6)',
                    borderColor: 'rgba(153, 0, 255, 1)',
                    borderWidth: 1
                },
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Certifications'
                    }
                },
                y: {
                    stacked: true,
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'AWS Certifications by Employee'
                },
                legend: {
                    position: 'bottom'
                }
            },
            indexAxis: 'y',
            stacked: true
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    // Write image to file
    fs.writeFileSync('./chart.png', imageBuffer);
})();