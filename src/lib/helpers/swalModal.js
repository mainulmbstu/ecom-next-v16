import Swal from "sweetalert2";

export const swalModal = (
  message = "Successsful",
  icon = "success",
  timer = 3000,
) => {
  console.log(timer);
  return Swal.fire({
    icon: icon, // warning, info, question, error
    text: message,
    position: "top-start",
    timer: timer,
    customClass: {
      popup: "md:ms-auto swalmodal  ",
      // popup: "swalmodal",
    },
    showConfirmButton: timer ? false : true,
    // title: "Your work has been saved",
    width: "90vw",
  });
};
