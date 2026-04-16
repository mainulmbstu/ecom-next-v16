import { wait } from "@/lib/helpers/helperFunction";
import AboutPage from "./AboutPage";
import Skeleton from "@/lib/components/Skeleton";

export const metadata = {
  title: "about",
  description: "about page",
};

const About = async () => {
  await wait(2000);

  return (
    <div>
      <AboutPage />
      <Skeleton />
    </div>
  );
};

export default About;
