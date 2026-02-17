import Comments from "./Comments";

const CommentData = async ({ pid }) => {
  let res = await fetch(
    `${process.env.BASE_URL}/api/user/all-comments?pid=${pid}`,
    {
      cache: "force-cache",
      next: { tags: ["comment-list"] },
    },
  );
  let data = await res.json();
  return (
    <div>
      <Comments data={data} />
    </div>
  );
};

export default CommentData;
