import { getPlaiceholder } from "plaiceholder";

let getBase64 = async (url) => {
  try {
    let res = await fetch(
      url ||
        "https://res.cloudinary.com/dgj1icpu7/image/upload/v1739850899/dir0m1r7wi2bphos1uqk.jpg"
    );
    if (!res.ok) {
      return;
      // throw new Error("Network response is not ok");
    }
    let buffer = await res.arrayBuffer();
    let { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  } catch (error) {
    console.log(error);
  }
};

export default getBase64;
