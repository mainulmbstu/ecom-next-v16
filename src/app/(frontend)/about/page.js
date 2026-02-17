import { wait } from "@/lib/helpers/helperFunction";
import AboutPage from "./AboutPage";

export const metadata = {
  title: "about",
  description: "about page",
};

const About = async () => {
  await wait(2000);

  return (
    <div>
      <AboutPage />
    </div>
  );
};

export default About;
