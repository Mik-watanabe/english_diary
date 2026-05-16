import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    style: {
      "--normal-text": "light-dark(var(--color-green-600), var(--color-green-400))",
      "--normal-border": "light-dark(var(--color-green-600), var(--color-green-400))",
    } as React.CSSProperties,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    style: {
      "--normal-text": "light-dark(var(--color-red-600), var(--color-red-400))",
      "--normal-border": "light-dark(var(--color-red-600), var(--color-red-400))",
    } as React.CSSProperties,
  });
};