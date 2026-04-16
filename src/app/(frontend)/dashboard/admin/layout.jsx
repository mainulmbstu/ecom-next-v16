import AdminMenu from "./AdminMenu";

export const metadata = {
  title: {
    default: "Admin dashboard",
    template: "%s | Admin dashboard | E-commerce",
    // absolute:""
  },
  description: "An e-commerce website",
};
export default function AdminLayout({ children }) {
  return (
    <div className=" grid md:grid-cols-4 gap-2">
      <div className=" md:col-span-1 ">
        <AdminMenu />
      </div>
      <div className=" md:col-span-3 mt-2">{children}</div>
    </div>
  );
}
