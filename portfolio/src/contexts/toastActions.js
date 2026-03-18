export const toastActions = {
    success: (addToast, message, duration) => addToast({ message, type: 'success', duration }),
    error: (addToast, message, duration) => addToast({ message, type: 'error', duration }),
    info: (addToast, message, duration) => addToast({ message, type: 'info', duration }),
};
