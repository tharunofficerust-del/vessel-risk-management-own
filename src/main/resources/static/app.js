const API = "/api/vessels";

let currentRiskFilter = "ALL";

let editId = null;
let riskChart = null;

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


    document.getElementById("totalCount").innerText =
        totalVessels;

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
                    <span class="risk-badge risk-${vessel.riskLevel.toLowerCase()}">
                        ${vessel.riskLevel}
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

    const lowRisk =
        allVessels.filter(v => v.riskLevel === "LOW").length;

    const mediumRisk =
        allVessels.filter(v => v.riskLevel === "MEDIUM").length;

    const highRisk =
        allVessels.filter(v => v.riskLevel === "HIGH").length;

    const criticalRisk =
        allVessels.filter(v => v.riskLevel === "CRITICAL").length;


    document.getElementById("lowRiskCount").innerText =
        lowRisk;

    document.getElementById("mediumRiskCount").innerText =
        mediumRisk;

    document.getElementById("highRiskCount").innerText =
        highRisk;

    document.getElementById("criticalRiskCount").innerText =
        criticalRisk;


    // =========================
    // RISK CHART
    // =========================

    const chartCanvas =
        document.getElementById("riskChart");

    if (chartCanvas) {

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

        eta:
            document.getElementById("eta").value,

        arrivalDate:
            document.getElementById("arrivalDate").value,

        departureDate:
            document.getElementById("departureDate").value
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
            "warning"
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

            document.getElementById("eta").value =
                vessel.eta.substring(0, 16);

            document.getElementById("arrivalDate").value =
                vessel.arrivalDate.substring(0, 16);

            document.getElementById("departureDate").value =
                vessel.departureDate.substring(0, 16);

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

