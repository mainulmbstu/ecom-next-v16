const ProgressBar = ({ progress = 0, color = "bg-blue-500" }) => {
  let test = {
    width: `${progress}%`,
    height: "100%",
    // backgroundColor: color,
    borderRadius: "9999px",
    textAlign: "center",
  };

  return (
    <div
      className={`my-1 w-72 h-6 rounded-3xl bg-yellow-100 ${progress > 0 ? "" : "invisible"}`}
    >
      <div style={test} className={color}>
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
