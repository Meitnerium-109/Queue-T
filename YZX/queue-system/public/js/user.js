document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (!currentUser.id || currentUser.role !== "user") {
        alert("Please login as a user to access this page!");
        window.location.href = "/login";
        return;
    }

    document.getElementById("userName").textContent = currentUser.username;

    checkUserQueue();

    function checkUserQueue() {
        const queues = JSON.parse(localStorage.getItem("queues") || "[]");
        let userQueue = queues.find(queue => queue.members.includes(currentUser.id));

        if (userQueue) {
            displayQueueStatus(userQueue);
        } else {
            document.getElementById("queueStatus").style.display = "none";
            document.getElementById("joinQueueSection").style.display = "block";
        }
    }

    function displayQueueStatus(queue) {
        const position = queue.members.indexOf(currentUser.id) + 1;
        const waitingTime = (position - 1) * 5;

        document.getElementById("queueStatus").style.display = "block";
        document.getElementById("joinQueueSection").style.display = "none";

        document.getElementById("queueStatus").innerHTML = `
            <h2>${queue.name}</h2>
            <p>Queue Code: <strong>${queue.code}</strong></p>
            <p>Your Position: <strong>${position}</strong></p>
            <p>People Ahead: <strong>${position - 1}</strong></p>
            <p>Estimated Waiting Time: <strong>${waitingTime} minutes</strong></p>
            <p>Queue Status: <strong>${queue.status === 'active' ? 'Active' : 'Paused'}</strong></p>
            <button onclick="leaveQueue('${queue.id}')">Leave Queue</button>
            <button onclick="refreshStatus()">Refresh Status</button>
        `;
    }

    window.joinQueue = function () {
        const queueCode = document.getElementById("queueCode").value;
        if (!queueCode) {
            alert("Please enter a queue code!");
            return;
        }

        const queues = JSON.parse(localStorage.getItem("queues") || "[]");
        let queue = queues.find(q => q.code === queueCode);

        if (!queue) {
            alert("Queue not found! Please check the code.");
            return;
        }

        if (queue.members.includes(currentUser.id)) {
            alert("You are already in this queue!");
            return;
        }

        queue.members.push(currentUser.id);
        localStorage.setItem("queues", JSON.stringify(queues));

        alert("Joined queue successfully!");
        displayQueueStatus(queue);
    };

    window.leaveQueue = function (queueId) {
        let queues = JSON.parse(localStorage.getItem("queues") || "[]");
        let queue = queues.find(q => q.id === queueId);

        if (!queue) {
            alert("Queue not found!");
            return;
        }

        queue.members = queue.members.filter(id => id !== currentUser.id);
        localStorage.setItem("queues", JSON.stringify(queues));

        alert("You have left the queue.");
        checkUserQueue();
    };

    window.refreshStatus = function () {
        checkUserQueue();
    };

    window.logout = function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
    };
});
