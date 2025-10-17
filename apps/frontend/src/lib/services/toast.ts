import { toast } from "sonner";

export class ToastService {
  success(title: string, message?: string, duration = 2000) {
    toast.success(title, {
      description: message,
      duration,
    });
  }

  error(title: string, message?: string, duration = 4000) {
    toast.error(title, {
      description: message,
      duration,
    });
  }

  info(title: string, message?: string, duration = 2000) {
    toast.info(title, {
      description: message,
      duration,
    });
  }

  warning(title: string, message?: string, duration = 3000) {
    toast.warning(title, {
      description: message,
      duration,
    });
  }
}

export const toastService = new ToastService();
