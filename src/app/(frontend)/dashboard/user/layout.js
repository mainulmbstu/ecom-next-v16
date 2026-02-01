
import UserMenu from "./UserMenu";


export const metadata = {
  title: {
    default: "User dashboard",
    template: "%s | User dashboard | Blog",
    // absolute:""
  },
  description: "A blog website",
};
export default function UserLayout({ children }) {
  return (
    <div className=" grid md:grid-cols-12 gap-2">
      <div className="col-span-12 md:col-span-3 card">
        <UserMenu />
      </div>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </div>
  );
}
