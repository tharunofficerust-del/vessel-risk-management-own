const API = "/api/vessels";

let currentRiskFilter = "ALL";

async function loadVessels() {

    const response = await fetch(API);

    const allVessels = await response.json();


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

                    <button
                        class="delete-btn"
                        onclick="deleteVessel(${vessel.vesselID})">

                        Delete

                    </button>

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

    console.log(vessels);
}



async function createVessel() {

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


    await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
    });


    loadVessels();
}



async function deleteVessel(id) {

    await fetch(`${API}/${id}`, {

        method: "DELETE"
    });

    loadVessels();
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