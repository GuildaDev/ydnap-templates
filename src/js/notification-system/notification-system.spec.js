import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NOTIFICATION_TYPE, showNotification } from '.';

describe('Notification System', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  });

  it('should show a success notification', () => {
    const expectedMessage = 'Success message';
    showNotification(expectedMessage, { type: NOTIFICATION_TYPE.SUCCESS });

    const notification = container.querySelector('.notification.success');
    expect(notification).not.toBeNull();
    expect(notification.innerText).toBe(expectedMessage);
  });

  it('should remove the notification after given duration', async () => {
    vi.useFakeTimers();
    showNotification('Error occurred', {
      type: NOTIFICATION_TYPE.ERROR,
      duration: 1500,
    });
    expect(container.children.length).toBe(1);

    vi.advanceTimersByTime(15000);
    expect(container.children.length).toBe(0);

    vi.useRealTimers();
  });

  it('should apply the correct class and message', () => {
    const expectedMessage = 'Be careful';
    showNotification(expectedMessage, { type: NOTIFICATION_TYPE.WARNING });

    const notification = container.querySelector('.notification.warning');
    expect(notification).not.toBeNull();
    expect(notification.innerText).toBe(expectedMessage);
  });
});
