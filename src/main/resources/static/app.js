const API = "/api/vessels";


async function loadVessels() {

    const response = await fetch(API);

    const vessels = await response.json();

    const table = document.getElementById("vesselTable");

    table.innerHTML = "";

    let high = 0;
    let critical = 0;
    let low = 0;

    vessels.forEach(vessel => {

        if (vessel.riskLevel === "HIGH") {
            high++;
        }

        if (vessel.riskLevel === "CRITICAL") {
            critical++;
        }

        if (vessel.riskLevel === "LOW") {
            low++;
        }

        table.innerHTML += `
            <tr>

                <td>${vessel.vesselID}</td>

                <td>${vessel.vesselName}</td>

                <td>${vessel.riskLevel}</td>

                <td><span class="priority-badge priority-${vessel.priorityLevel.toLowerCase()}">${vessel.priorityLevel}</span></td>

                <td>${vessel.delayHours} hrs</td>

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


    document.getElementById("totalCount").innerText =
        vessels.length;

    document.getElementById("highCount").innerText =
        high;

    document.getElementById("criticalCount").innerText =
        critical;

    document.getElementById("lowCount").innerText =
        low;
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


loadVessels();