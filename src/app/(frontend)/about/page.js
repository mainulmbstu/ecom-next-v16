import { wait } from "@/lib/helpers/helperFunction";
import Image from "next/image";

export const metadata = {
  title: "about",
  description: "about page",
};

const About = async () => {
  await wait(2000);
  return <div>About</div>;
};

export default About;
