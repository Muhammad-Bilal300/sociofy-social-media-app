import Swal, { SweetAlertIcon } from "sweetalert2";

type AlertDialogProps = {
  title?: string;
  text: string;
  icon: SweetAlertIcon;
  timer?: number;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  okAction?: () => void;
  cancelAction?: () => void;
};

const AlertDialog = ({
  title = "",
  text,
  icon,
  timer = 0,
  showConfirmButton = false,
  showCancelButton = false,
  confirmButtonText = "",
  cancelButtonText = "",
  okAction,
  cancelAction,
}: AlertDialogProps): Promise<void> => {
  return Swal.fire({
    title: title !== "" ? title : undefined,
    text,
    icon,
    timer: timer !== 0 ? timer : undefined,
    showConfirmButton,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      icon: "small-icon", // Apply the class for small icon size
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (okAction) {
        okAction();
      }
    } else if (result.isDismissed && cancelAction) {
      cancelAction();
    }
  });
};

export default AlertDialog;
