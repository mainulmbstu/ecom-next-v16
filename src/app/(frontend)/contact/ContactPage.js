"use client";
import { useAuth } from "@/lib/components/context";
import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import toast from "react-hot-toast";
import { contactAction } from "./action";
import { use } from "react";

const ContactPage = ({ promise }) => {
  // let data = use(promise);
  // let list = JSON.parse(data?.list);
  // console.log(list);
  let { userInfo } = useAuth();
  let clientAction = async (formData) => {
    let data = await contactAction(formData);
    if (data?.success) {
      // Swal.fire("Success", data?.message, "success");
      toast.success(data?.message);
    } else {
      // Swal.fire("Error", data?.message, "error");
      toast.error(data?.message);
    }
  };
  return (
    <div className="grid grid-cols-12">
      <div className="md:col-span-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16941.195449050145!2d90.49198314750565!3d24.191606533985944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37567906d26718f7%3A0xc2b28acee7accb9!2sNourish%20Poultry%20%26%20Hatchery%20Ltd.!5e0!3m2!1sen!2sbd!4v1728467477481!5m2!1sen!2sbd"
          width={"100%"}
          height={350}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="md:col-span-4">
        <div className="px-4">
          <h2 className=" text-center">Contact us</h2>
          <div className=" flex justify-center">
            <Form action={clientAction} className=" w-100">
              <input
                className=" mb-3 input"
                type="text"
                name="name"
                defaultValue={userInfo?.name}
                placeholder="Name"
                required
              />
              <input
                className=" mb-3 input"
                type="email"
                name="email"
                defaultValue={userInfo?.email}
                placeholder="email"
                required
              />
              <textarea
                className=" mb-3 input"
                rows="4"
                type="text"
                name="message"
                placeholder="Type your message"
                required
              ></textarea>
              <div className="mt-3">
                <SubmitButton title={"Submit"} design={"btn-accent w-full"} />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
