"use client";

import { useFormStatus } from "react-dom";

const SubmitButton = ({
  title = "Submit",
  design = "btn-primary  cursor-pointer",
  disable,
  value = "",
}) => {
  let { pending } = useFormStatus();
  return (
    <button
      name="action"
      value={value}
      type="submit"
      disabled={pending || disable}
      className={`btn  disabled:text-black ${design}`}
    >
      {pending ? "Submitting..." : title}
    </button>
  );
};

export default SubmitButton;
