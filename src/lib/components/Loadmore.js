"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";

const Loadmore = ({ page, perPage, total, spms1, spms1Value = "" }) => {
  let router = useRouter();
  let path = usePathname();
  let loadMoreRef = useCallback(
    (node) => {
      if (!node) return;
      if (perPage >= total) return;
      let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            router.push(
              `${path}?${spms1}=${spms1Value}&page=1&perPage=${perPage + 12}`,
              {
                scroll: false,
              }
            );
            observer.disconnect();
          }
        });
      });
      observer.observe(node);
    },
    [perPage]
  );
  return <div ref={loadMoreRef}></div>;
};

export default Loadmore;
