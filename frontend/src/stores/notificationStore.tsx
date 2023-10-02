import { notifications as mantineNotifications } from "@mantine/notifications";
import {
  IconCheck,
  IconExclamationMark,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { create } from "zustand";

const NotificationTypeColors = {
  error: "red",
  info: "blue",
  success: "green",
  warning: "yellow",
  loading: "blue",
};

type Notification = {
  id: string;
  /** message to display */
  message: string;
};

type NotificationOptions = {
  /** if true, notification will be closed automatically */
  autoClose?: boolean;
  /** icon to display before message */
  icon?: React.ReactNode;
  /** tell timeout in milliseconds to close notification */
  timeout?: number;
  /** type of notification */
  type?: keyof typeof NotificationTypeColors;
};

type NotificationsStore = {
  /** Add an error notification in the notification store */
  addErrorNotification: (
    message: string,
    options?: NotificationOptions
  ) => void;
  /** Add an info notification in the notification store */
  addInfoNotification: (message: string, options?: NotificationOptions) => void;
  /**  Add an loading notification in the notification store */
  addLoadingNotification: (
    message: string,
    options?: NotificationOptions
  ) => (
    updatedMessage?: string,
    type?: keyof typeof NotificationTypeColors
  ) => void;
  /** Add a notification in the notification store */
  addNotification: (message: string, options?: NotificationOptions) => string;
  /** Add a success notification in the notification store */
  addSuccessNotification: (
    message: string,
    options?: NotificationOptions
  ) => void;
  /** Add a warning notification in the notification store */
  addWarningNotification: (
    message: string,
    options?: NotificationOptions
  ) => void;
  /** Deletes a notification from the notification store */
  deleteNotification: (notificationId: string) => void;
  /** using this as primary key for generating unique notification id */
  lastNotificationId: number;

  /** list of notifications in store */
  notifications: Notification[];
  /** Update a notification in the notification store */
  updateNotification: (
    notificationId: string,
    message: string,
    options?: NotificationOptions
  ) => void;
};

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  lastNotificationId: 0,

  addNotification: (message: string, options?: NotificationOptions) => {
    const { lastNotificationId, deleteNotification } = get();
    const newNotificationId = lastNotificationId + 1;
    const newNotification = { message, id: newNotificationId.toString() };
    set((cs) => ({
      notifications: [...cs.notifications, newNotification],
      lastNotificationId: newNotificationId,
    }));
    mantineNotifications.show({
      ...newNotification,
      onClose: () => deleteNotification(newNotification.id),
      autoClose:
        options?.timeout || options?.autoClose !== undefined
          ? options?.autoClose
          : true,
      color: NotificationTypeColors[options?.type || "info"],
      icon: options?.icon,
      withBorder: true,
      loading: options?.type === "loading",
      withCloseButton: options?.type !== "loading",
    });
    return newNotificationId.toString();
  },

  updateNotification: (
    notificationId: string,
    message: string,
    options?: NotificationOptions
  ) => {
    mantineNotifications.update({
      id: notificationId,
      message,
      color: NotificationTypeColors[options?.type || "info"],
      ...options,
    });
  },

  deleteNotification: (notificationId: string) => {
    const { notifications } = get();
    mantineNotifications.hide(notificationId);
    const updatedNotifications = notifications.filter(
      (i) => i.id !== notificationId
    );
    set((cs) => ({ ...cs, notifications: [...updatedNotifications] }));
  },

  addSuccessNotification: (message: string, options?: NotificationOptions) => {
    const { addNotification } = get();
    addNotification(message, {
      ...options,
      type: "success",
      icon: <IconCheck />,
    });
  },

  addErrorNotification: (message: string, options?: NotificationOptions) => {
    const { addNotification } = get();
    addNotification(message, { ...options, type: "error", icon: <IconX /> });
  },

  addWarningNotification: (message: string, options?: NotificationOptions) => {
    const { addNotification } = get();
    addNotification(message, {
      ...options,
      type: "warning",
      icon: <IconExclamationMark />,
    });
  },

  addInfoNotification: (message: string, options?: NotificationOptions) => {
    const { addNotification } = get();
    addNotification(message, {
      ...options,
      type: "info",
      icon: <IconInfoCircle />,
    });
  },

  addLoadingNotification: (message: string, options?: NotificationOptions) => {
    const { addNotification, updateNotification, deleteNotification } = get();
    const notificationId = addNotification(message, {
      ...options,
      type: "loading",
      icon: <IconInfoCircle />,
      autoClose: false,
    });
    return (
      updatedMessage?: string,
      type?: keyof typeof NotificationTypeColors
    ) =>
      updatedMessage
        ? updateNotification(notificationId, updatedMessage || message, {
            ...options,
            type: type || "success",
            icon: <IconCheck />,
            autoClose: true,
          })
        : deleteNotification(notificationId);
  },
}));

export const {
  addSuccessNotification,
  addErrorNotification,
  addInfoNotification,
  addWarningNotification,
  addLoadingNotification,
} = useNotificationsStore.getState();
