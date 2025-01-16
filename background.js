setInterval(() => {
  //TODO: refactor this
  chrome.storage.local.get(["tasks"], (result) => {
    const tasks = result.tasks || [];

    if (tasks.length > 0) {
      chrome.notifications.create(
        {
          type: "basic",
          iconUrl: "images/call.png",
          title: "Task Reminder",
          message: `You have ${tasks.length} task(s) pending!`,
          priority: 2,
        },
        (notificationId) => {
          console.log("Notification sent: " + notificationId);
        }
      );
    }
  });
}, 5000);
