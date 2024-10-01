const html2canvas = require('html2canvas');

function screenshot() {
    html2canvas(document.body).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'screenshot.png';
        link.click();
    });
}