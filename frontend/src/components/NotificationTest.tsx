import { Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

export const NotificationTest = () => {
  const showNotification = () => {
    notifications.show({
      title: 'Test Notification',
      message: 'This is a test notification to verify positioning',
      color: 'green',
      icon: <IconCheck size={18} />,
      autoClose: 5000,
      withCloseButton: true,
    });
  };

  return (
    <Group justify="center" mt="md">
      <Button onClick={showNotification} color="green">
        Show Test Notification
      </Button>
    </Group>
  );
};
