const Skeleton = () => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {Array.from({ length: 12 }, (v, i) => (
        <div key={i} className="flex flex-col gap-4">
          {/* <div className="bg-gray-300 h-64 w-full relative overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full animate-shimmer
                         bg-linear-to-r from-transparent via-gray-200 to-transparent"
            ></div>
          </div>*/}
          <div className="bg-gray-300 animate-pulse h-64 w-full"></div>
          <div className="bg-gray-300 animate-pulse h-4 w-28"></div>
          <div className="bg-gray-300 animate-pulse h-4 w-44"></div>
          <div className="bg-gray-300 animate-pulse h-4 w-40"></div>
          <div className="bg-gray-300 animate-pulse h-4 w-full"></div>
          <div className="bg-gray-300 animate-pulse h-4 w-full"></div>
          <div className="bg-gray-300 animate-pulse h-4 w-20"></div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
