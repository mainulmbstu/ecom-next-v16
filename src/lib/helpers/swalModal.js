import Swal from "sweetalert2";

export const swalModal = async (message = "Successsful", icon = "success") => {
  return Swal.fire({
    icon: icon, // warning, info, question, error
    text: message,
    position: "top-start",
    timer: 3000,
    customClass: {
      popup: "md:ms-auto swalmodal  ",
      // popup: "swalmodal",
    },
    showConfirmButton: false,
    // title: "Your work has been saved",
    width: "90vw",
  });
};
