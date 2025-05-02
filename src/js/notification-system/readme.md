## Usage Example

### HTML

```html
<div id="notification-container"></div>
<button
  onclick="showNotification('message', { type: NOTIFICATION_TYPE.SUCCESS })"
>
  Success
</button>
```

### CSS

```css
#notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  padding: 15px 20px;
  border-radius: 5px;
  font-size: 14px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}

.notification.warning {
  background-color: #ff9800;
}

.notification.info {
  background-color: #2196f3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
