import Image from "next/image";

export const metadata = {
  title: "about",
  description: "about page",
};

const About = async () => {
  let mmm = async () => {
    "use server";
    console.log(22222222222);
  };
  return <div>About</div>;
};

export default About;
