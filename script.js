document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    fetch('http://localhost:3000/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('reportForm').reset();
        loadReports();
    });
});

function loadReports() {
    fetch('http://localhost:3000/reports')
        .then(response => response.json())
        .then(data => {
            const reportList = document.getElementById('reportList');
            reportList.innerHTML = '';
            data.forEach(report => {
                const li = document.createElement('li');
                li.textContent = `${report.title}: ${report.description}`;
                reportList.appendChild(li);
            });
        });
}

// Load reports on page load
window.onload = loadReports;
