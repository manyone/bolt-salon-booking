import toast from 'react-hot-toast';

interface NotificationParams {
  to: string;
  subject: string;
  message: string;
  type: string;
}

export const sendNotification = async (params: NotificationParams) => {
  // In a real application, this would integrate with an email/SMS service
  console.log('Sending notification:', params);
  
  // Show toast notification to the user
  toast.success(params.message, {
    duration: 5000,
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Notification sent via ${params.type} to ${params.to}`);
      resolve(true);
    }, 1000);
  });
};