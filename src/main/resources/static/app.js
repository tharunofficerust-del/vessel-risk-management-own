const API = "/api/vessels";

let currentRiskFilter = "ALL";

let editId = null;
let riskChart = null;
let chartAnimated = false;


function animateCounter(elementId, targetValue, suffix = "") {

    const element = document.getElementById(elementId);

    const duration = 1000; // 1 second
    const steps = 30;
    const increment = targetValue / steps;

    let currentValue = 0;
    let currentStep = 0;

    const timer = setInterval(() => {

        currentStep++;

        currentValue += increment;

        if (currentStep >= steps) {

            currentValue = targetValue;

            clearInterval(timer);
        }

        element.innerText =
            `${Math.round(currentValue)}${suffix}`;

    }, duration / steps);
}

function observeRiskChart() {

    const chartWrapper =
        document.querySelector(".chart-wrapper");

    if (!chartWrapper || chartAnimated) {
        return;
    }

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    chartAnimated = true;

                    loadVessels();

                    observer.disconnect();
                }

            });

        },

        {
            threshold: 0.4
        }

    );

    observer.observe(chartWrapper);
}

async function loadVessels() {

    const response = await fetch(API);

    const allVessels = await response.json();
    // =========================
    // NOTIFICATIONS
    // =========================

    const notifications = [];

    allVessels.forEach(vessel => {

        if (vessel.riskLevel === "CRITICAL") {

            notifications.push(
                `🚨 ${vessel.vesselName} requires immediate attention`
            );
        }

        else if (vessel.riskLevel === "HIGH") {

            notifications.push(
                `⚠ ${vessel.vesselName} has high operational risk`
            );
        }

        if (vessel.delayHours > 48) {

            notifications.push(
                `⏰ ${vessel.vesselName} delayed by ${vessel.delayHours} hours`
            );
        }

    });

    // =========================
    // UPCOMING ARRIVALS
    // =========================

    const upcomingArrivals = [...allVessels]
        .filter(vessel =>
            vessel.status === "IN_TRANSIT"
            && vessel.eta
        )

        .sort((a, b) =>
            new Date(a.eta) - new Date(b.eta)
        )

        .slice(0, 5);


    const arrivalList =
        document.getElementById("arrivalList");


    if (arrivalList) {

        if (upcomingArrivals.length === 0) {

            arrivalList.innerHTML =
                "<p>No upcoming arrivals</p>";

        }

        else {

            arrivalList.innerHTML =

                upcomingArrivals.map(vessel => `

                <div class="arrival-item">

                    <strong>

                        🚢 ${vessel.vesselName}

                    </strong>

                    <span>

                        ETA:
                        ${new Date(vessel.eta)
                        .toLocaleDateString()}

                    </span>

                    <small>

                        Status:
                        ${vessel.status.replace("_", " ")}

                    </small>

                </div>

            `).join("");

        }

    }
    // =========================
    // DASHBOARD CARDS
    // =========================

    const totalVessels = allVessels.length;

    const totalDelayHours = allVessels.reduce(
        (sum, vessel) => sum + vessel.delayHours,
        0
    );

    const criticalCount = allVessels.filter(
        vessel => vessel.riskLevel === "CRITICAL"
    ).length;

    const averageDelayHours =
        totalVessels === 0
            ? 0
            : Math.round(totalDelayHours / totalVessels);


    animateCounter( "totalCount", totalVessels );

    document.getElementById("totalDelayCount").innerText =
        `${totalDelayHours} hrs`;

    document.getElementById("criticalCount").innerText =
        criticalCount;

    document.getElementById("averageDelayCount").innerText =
        `${averageDelayHours} hrs`;

    const notificationList =
        document.getElementById("notificationList");

    if (notificationList) {

        if (notifications.length === 0) {

            notificationList.innerHTML =
                "<p>✅ No active notifications</p>";
        }

        else {

            notificationList.innerHTML =
                notifications
                    .slice(0, 5)
                    .map(notification =>

                        `<div class="notification-item">

                        ${notification}

                    </div>`

                    )
                    .join("");

        }

    }
    // =========================
    // SEARCH + FILTERS
    // =========================

    let vessels = [...allVessels];

    const searchValue =
        document
            .getElementById("searchBox")
            ?.value
            .toLowerCase() || "";

    vessels = vessels.filter(vessel =>
        vessel.vesselName
            .toLowerCase()
            .includes(searchValue)
    );

    if (currentRiskFilter !== "ALL") {

        vessels = vessels.filter(
            vessel => vessel.riskLevel === currentRiskFilter
        );
    }


    // =========================
    // TABLE
    // =========================

    const table = document.getElementById("vesselTable");

    table.innerHTML = "";

    vessels.forEach(vessel => {

        table.innerHTML += `
            <tr>

                <td>${vessel.vesselID}</td>

                <td>${vessel.vesselName}</td>

                <td>
                    <span class="risk-badge risk-${(vessel.riskLevel || "NONE").toLowerCase()}">
                        ${vessel.riskLevel || "NONE"}
                    </span>
                </td>

                <td>
                    <span class="status-badge status-${(vessel.status || "SCHEDULED").toLowerCase()}">
                        ${(vessel.status || "SCHEDULED").replace("_", " ")}
                    </span>
                </td>

                <td>${vessel.delayHours} hrs</td>

                <td>${vessel.priorityLevel}</td>

                <td>

                    <div class="action-buttons">

                        <button
                                class="edit-btn"
                                onclick="editVessel(${vessel.vesselID})">

                            Edit

                        </button>

                        <button
                                class="delete-btn"
                                onclick="deleteVessel(${vessel.vesselID})">

                            Delete

                        </button>

                    </div>

                </td>

            </tr>
        `;
    });


    // =========================
    // RISK ANALYTICS
    // =========================
    const noneRisk =
        allVessels.filter(v => v.riskLevel === "NONE").length;

    const lowRisk =
        allVessels.filter(v => v.riskLevel === "LOW").length;

    const mediumRisk =
        allVessels.filter(v => v.riskLevel === "MEDIUM").length;

    const highRisk =
        allVessels.filter(v => v.riskLevel === "HIGH").length;

    const criticalRisk =
        allVessels.filter(v => v.riskLevel === "CRITICAL").length;


    document.getElementById("noneRiskCount").innerText =
        noneRisk;

    document.getElementById("lowRiskCount").innerText =
        lowRisk;

    document.getElementById("mediumRiskCount").innerText =
        mediumRisk;

    document.getElementById("highRiskCount").innerText =
        highRisk;

    document.getElementById("criticalRiskCount").innerText =
        criticalRisk;


    // =========================
    // STATUS ANALYTICS
    // =========================

    const scheduledCount =
        allVessels.filter(
            v => v.status === "SCHEDULED"
        ).length;

    const transitCount =
        allVessels.filter(
            v => v.status === "IN_TRANSIT"
        ).length;

    const delayedCount =
        allVessels.filter(
            v => v.status === "DELAYED"
        ).length;

    const arrivedCount =
        allVessels.filter(
            v => v.status === "ARRIVED"
        ).length;

    const berthedCount =
        allVessels.filter(
            v => v.status === "BERTHED"
        ).length;


    document.getElementById("scheduledCount").innerText =
        scheduledCount;

    document.getElementById("transitCount").innerText =
        transitCount;

    document.getElementById("delayedCount").innerText =
        delayedCount;

    document.getElementById("arrivedCount").innerText =
        arrivedCount;

    document.getElementById("berthedCount").innerText =
        berthedCount;

    // =========================
    // RISK CHART
    // =========================

    const chartCanvas =
        document.getElementById("riskChart");

    if (chartCanvas && chartAnimated) {

        if (riskChart) {
            riskChart.destroy();
        }

        const ctx =
            chartCanvas.getContext("2d");

        riskChart = new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: [
                    "Low",
                    "Medium",
                    "High",
                    "Critical"
                ],

                datasets: [{

                    data: [
                        lowRisk,
                        mediumRisk,
                        highRisk,
                        criticalRisk
                    ],

                    backgroundColor: [
                        "#7BC043",
                        "#F4C542",
                        "#F39C12",
                        "#E74C3C"
                    ],

                    borderWidth: 2
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: true,

                plugins: {

                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }


    // =========================
    // DELAY ANALYTICS
    // =========================

    const maxDelay =
        Math.max(...allVessels.map(v => v.delayHours));

    const minDelay =
        Math.min(...allVessels.map(v => v.delayHours));


    document.getElementById("analyticsTotalDelay").innerText =
        `${totalDelayHours} hrs`;

    document.getElementById("analyticsAvgDelay").innerText =
        `${averageDelayHours} hrs`;

    document.getElementById("analyticsMaxDelay").innerText =
        `${maxDelay} hrs`;

    document.getElementById("analyticsMinDelay").innerText =
        `${minDelay} hrs`;



    // =========================
    // CARGO ANALYTICS
    // =========================

    document.getElementById("generalCargoCount").innerText =
        allVessels.filter(v => v.cargoType === "GENERAL").length;

    document.getElementById("hazardousCargoCount").innerText =
        allVessels.filter(v => v.cargoType === "HAZARDOUS").length;

    document.getElementById("fragileCargoCount").innerText =
        allVessels.filter(v => v.cargoType === "FRAGILE").length;

    document.getElementById("reeferCargoCount").innerText =
        allVessels.filter(v => v.cargoType === "REEFER").length;

    console.log("Filtered vessels:", vessels);
}



async function saveVessel() {

    const data = {

        vesselName:
            document.getElementById("vesselName").value,

        cargoType:
            document.getElementById("cargoType").value,

        delayReason:
            document.getElementById("delayReason").value,

        status:
            document.getElementById("status").value,

        eta:
            document.getElementById("eta").value,

        arrivalDate:
            document.getElementById("arrivalDate").value,

        departureDate:
            document.getElementById("departureDate").value,


    };


    const method =
        editId ? "PUT" : "POST";

    const url =
        editId ? `${API}/${editId}` : API;


    try {

        const response = await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.message || "Failed to save vessel"
            );
        }

        showToast(

            editId
                ? "✅ Vessel updated successfully"
                : "✅ Vessel created successfully",

            "success"
        );

        await loadVessels();

        clearForm();

        editId = null;

    }
    catch (error) {

        showToast(

            `❌ ${error.message}`,

            "error"
        );

        console.error(error);
    }
}


async function deleteVessel(id) {

    const confirmed = confirm(
        `Are you sure you want to delete Vessel ID ${id}?`
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`${API}/${id}`, {

            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        showToast(
            "🗑️ Vessel deleted successfully",
            "success"
        );

        await loadVessels();

    }
    catch (error) {

        showToast(
            "❌ Failed to delete vessel",
            "error"
        );

        console.error(error);
    }
}



function setRiskFilter(risk, button) {

    currentRiskFilter = risk;

    document
        .querySelectorAll(".filter-pill")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    loadVessels();
}


loadVessels();
observeRiskChart();
handleStatusChange();


//-----------------------------------------------------------------

function editVessel(id) {

    fetch(`${API}/${id}`)

        .then(response => response.json())

        .then(vessel => {

            editId = id;

            document.getElementById("vesselName").value =
                vessel.vesselName;

            document.getElementById("cargoType").value =
                vessel.cargoType;

            document.getElementById("delayReason").value =
                vessel.delayReason;

            document.getElementById("status").value =
                vessel.status;
            handleStatusChange();

            document.getElementById("eta").value =
                vessel.eta
                    ? vessel.eta.substring(0, 16)
                    : "";

            document.getElementById("arrivalDate").value =
                vessel.arrivalDate
                    ? vessel.arrivalDate.substring(0, 16)
                    : "";

            document.getElementById("departureDate").value =
                vessel.departureDate
                    ? vessel.departureDate.substring(0, 16)
                    : "";

            document.getElementById("submitBtn")
                .innerText = "Update Vessel";

            document.getElementById("cancelBtn")
                .style.display = "block";

        })   // <-- THIS WAS MISSING

        .catch(error => {

            showToast(
                "❌ Failed to load vessel data",
                "error"
            );

            console.error(error);

        });

}


function cancelEdit() {

    editId = null;

    clearForm();

}


function clearForm() {

    document.getElementById("vesselName").value = "";

    document.getElementById("cargoType").selectedIndex = 0;

    document.getElementById("delayReason").selectedIndex = 0;

    document.getElementById("eta").value = "";

    document.getElementById("arrivalDate").value = "";

    document.getElementById("departureDate").value = "";

    document.getElementById("status").selectedIndex = 0;

    handleStatusChange();

    document.getElementById("submitBtn")
        .innerText = "Create Vessel";

    document.getElementById("cancelBtn")
        .style.display = "none";

}

function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.className =
        `toast ${type} show`;

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}

async function exportCSV() {

    try {

        const response = await fetch(API);

        const vessels = await response.json();

        let csv =

            "ID,Vessel,Risk,Priority,Delay Hours,Cargo Type\n";


        vessels.forEach(vessel => {

            csv +=

                `${vessel.vesselID},` +
                `${vessel.vesselName},` +
                `${vessel.riskLevel},` +
                `${vessel.priorityLevel},` +
                `${vessel.delayHours},` +
                `${vessel.cargoType}\n`;

        });


        const blob = new Blob(

            [csv],

            { type: "text/csv" }
        );


        const url =
            window.URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download = "vessel-report.csv";

        a.click();

        window.URL.revokeObjectURL(url);


        document.getElementById("lastExport")
            .innerText =
            `Last Export: ${new Date().toLocaleString()}`;


        showToast(
            "📄 CSV exported successfully",
            "success"
        );

    }
    catch (error) {

        showToast(
            "❌ Export failed",
            "error"
        );

    }

}

//Status Update logic

function handleStatusChange() {

    const status =
        document.getElementById("status").value;

    const arrivalDate =
        document.getElementById("arrivalDate");

    const eta =
        document.getElementById("eta");

    const futureStatuses = [

        "SCHEDULED",
        "IN_TRANSIT",
        "DELAYED"

    ];

    if (futureStatuses.includes(status)) {

        arrivalDate.disabled = true;
        arrivalDate.value = "";

        eta.disabled = false;

    }
    else {

        arrivalDate.disabled = false;

    }

}

// Pdf Export logic

async function exportPdf() {

    console.log("PDF button clicked");

    try {

        const response = await fetch(
            `${API}/export/pdf`
        );

        if (!response.ok) {
            throw new Error("PDF export failed");
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "vessel-report.pdf";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

        // Update last export time
        const exportTime = new Date().toLocaleString();

        document.getElementById("lastExport").innerText =
            `Last Export: ${exportTime} (PDF)`;

        showToast(
            "PDF exported successfully",
            "success"
        );



        localStorage.setItem("lastExport",`Last Export: ${exportTime} (PDF)`);

            const lastExport = localStorage.getItem("lastExport");

            if (lastExport) {
                document.getElementById("lastExport").innerText = lastExport;
            }

    } catch (error) {

        console.error(error);

        showToast(
            "Failed to export PDF",
            "error"
        );
    }

    
}

document
    .getElementById("exportPdfBtn")
    .addEventListener(
        "click",
        exportPdf
    );

const lastExport = localStorage.getItem("lastExport");

if (lastExport) {

    document.getElementById("lastExport").innerText =
        lastExport;
}