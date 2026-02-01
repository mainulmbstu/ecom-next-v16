"use client";

import Link from "next/link";
import { ImProfile } from "react-icons/im";
import { FaListOl } from "react-icons/fa";

import { usePathname } from "next/navigation";

const UserMenu = () => {
  let path = usePathname();
  let menus = [
    {
      name: "profile",
      href: "/dashboard/user/profile",
      icon: <ImProfile />,
    },

    {
      name: "My Orders",
      href: "/dashboard/user/order-list",
      icon: <FaListOl />,
    },
  ];

  return (
    <div className="card p-2">
      <Link
        className={
          path === "/dashboard/admin"
            ? "bg-blue-300 p-3"
            : "hover:bg-zinc-300 p-3"
        }
        href={"/dashboard/admin"}
      >
        Dashboard
      </Link>
      <ul className="menu rounded-box w-full">
        {menus.map((item, i) => (
          <li key={i} className={item.href === path ? "bg-blue-300" : ""}>
            <Link href={item.href}>
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserMenu;
