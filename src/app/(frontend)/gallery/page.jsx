import Carousel2 from "@/lib/components/carousel2";
import GalleryPage from "./GalleryPage";
import Carousel from "@/lib/components/carousel";

export const metadata = {
  title: "Gallery",
  description: "Gallery page",
};

const Gallery = async () => {
  let slides = [
    "/adds.jpeg",
    "/placeholder.jpg",
    "/dummy.jpeg",
    "/adds.jpeg",
    "/placeholder.jpg",
    "/dummy.jpeg",
  ];
  return (
    <div>
      <GalleryPage />
      {/* <Carousel slides={slides} autoPlay={true} interval={2000} /> */}
      <Carousel2 slides={slides} autoPlay={true} interval={2000} />
    </div>
  );
};

export default Gallery;
