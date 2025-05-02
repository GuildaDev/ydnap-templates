// This is a closure state
function makeNotificationSetup() {
  const setup_state = { duration: 3000 };

  return {
    setDuration: (duration) => {
      setup_state.duration = duration;
    },
    getState: setup_state,
  };
}

const setup = makeNotificationSetup();

document.addEventListener('notification', (event) => {
  const notificationEvent = event;
  const { type, message, duration } = notificationEvent.detail;

  const notificationContainer = document.getElementById(
    'notification-container'
  );
  if (notificationContainer) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
      notificationContainer?.removeChild(notification);
    }, duration || setup.getState.duration);
  } else {
    console.error('Notification container not found');
  }
});

// If you are using vanilla, you dont need export NOTIFICATION_TYPE and showNotification
export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export function showNotification(message, options) {
  const event = new CustomEvent('notification', {
    detail: {
      message,
      type: options?.type,
      duration: options?.duration || setup.getState.duration,
    },
  });

  document.dispatchEvent(event);
}
