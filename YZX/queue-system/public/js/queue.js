document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (!currentUser.id || currentUser.role !== "admin") {
        alert("Please login as an admin to access this page!");
        window.location.href = "/login";
        return;
    }

    document.getElementById("adminName").textContent = currentUser.username;
    loadQueues();

    function loadQueues() {
        const queues = JSON.parse(localStorage.getItem("queues") || "[]");
        const adminQueues = queues.filter(queue => queue.adminId === currentUser.id);

        const queuesList = document.getElementById("queuesList");
        queuesList.innerHTML = "";

        if (adminQueues.length === 0) {
            queuesList.innerHTML = "<p>No queues created yet.</p>";
            return;
        }

        adminQueues.forEach(queue => {
            const queueElement = document.createElement("div");
            queueElement.className = "queue";
            queueElement.innerHTML = `
                <h3>${queue.name}</h3>
                <p>Queue Code: <strong>${queue.code}</strong></p>
                <p>Password: <strong>${queue.password}</strong></p>
                <p>Status: ${queue.status}</p>
                <p>People in queue: <span id="peopleInQueue-${queue.id}">${queue.members.length}</span></p>
                <button onclick="toggleQueueStatus('${queue.id}')">
                    ${queue.status === 'active' ? 'Pause Queue' : 'Activate Queue'}
                </button>
                <button onclick="nextCustomer('${queue.id}')">Next Customer</button>
                <button onclick="deleteQueue('${queue.id}')">Delete Queue</button>
            `;
            queuesList.appendChild(queueElement);
        });
    }

    window.nextCustomer = function (queueId) {
        const queues = JSON.parse(localStorage.getItem("queues") || "[]");
        const queueIndex = queues.findIndex(q => q.id === queueId);
    
        if (queueIndex !== -1 && queues[queueIndex].members.length > 0) {
            const queue = queues[queueIndex];
    
            // Remove the first user
            queue.members.shift();
            queue.currentPosition++;
    
            localStorage.setItem("queues", JSON.stringify(queues));
    
            document.getElementById(`peopleInQueue-${queueId}`).textContent = queue.members.length;
    
            // Notify all users
            localStorage.setItem("queueUpdated", Date.now());
    
            alert("Next customer called!");
        } else {
            alert("No customers in queue!");
        }
    };

    window.toggleQueueStatus = function (queueId) {
        const queues = JSON.parse(localStorage.getItem("queues") || "[]");
        const queueIndex = queues.findIndex(q => q.id === queueId);
    
        if (queueIndex !== -1) {
            // Toggle queue status
            queues[queueIndex].status = queues[queueIndex].status === "active" ? "inactive" : "active";
    
            // Update localStorage
            localStorage.setItem("queues", JSON.stringify(queues));
    
            // Show an alert to confirm action
            alert(`Queue is now ${queues[queueIndex].status === "active" ? "active" : "paused"}.`);
    
            // Reload queue list to reflect the new status
            loadQueues();
        } else {
            alert("Queue not found!");
        }
    };

    window.deleteQueue = function (queueId) {
        if (confirm("Are you sure you want to delete this queue?")) {
            let queues = JSON.parse(localStorage.getItem("queues") || "[]");
            queues = queues.filter(q => q.id !== queueId);
            localStorage.setItem("queues", JSON.stringify(queues));
            loadQueues();
        }
    };

    window.logout = function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/";
    };
});
