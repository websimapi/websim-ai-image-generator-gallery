import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { useQuery } from "@websim/use-query";
const LeaderboardTab = ({ room }) => {
  const { data: leaderboardData, loading: leaderboardLoading } = useQuery(room.query(`
        SELECT 
            ug.id as user_id,
            u.username,
            COALESCE(jsonb_array_length(ug.generated_images), 0) as generated_count,
            COALESCE(jsonb_array_length(ug.forked_images), 0) as forked_count,
            COALESCE(jsonb_array_length(ug.public_gallery), 0) as public_count,
            ug.last_sync as last_activity
        FROM public.user_gallery ug
        JOIN public.user u ON ug.id::uuid = u.id
        ORDER BY (COALESCE(jsonb_array_length(ug.generated_images), 0) + COALESCE(jsonb_array_length(ug.forked_images), 0)) DESC
    `));
  const leaderboard = leaderboardData?.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
    totalActivity: entry.generated_count + entry.forked_count
  })) || [];
  if (leaderboardLoading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-6", children: "Leaderboard" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 27,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "loading-shimmer w-full h-64 rounded-lg" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 28,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 26,
      columnNumber: 13
    });
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-6", children: "Leaderboard" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 35,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { children: "Rank" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 38,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { children: "User" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 39,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { children: "Generated" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 40,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { children: "Forked" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 41,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { children: "Public" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 42,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { children: "Last Activity" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 43,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 37,
        columnNumber: 17
      }),
      leaderboard.map((entry) => /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-6 gap-4 p-4 border-t border-gray-100 hover:bg-gray-50", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "font-mono", children: [
          "#",
          entry.rank
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 47,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: `https://images.websim.com/avatar/${entry.username}`,
              className: "w-6 h-6 rounded-full",
              alt: "Avatar"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 49,
              columnNumber: 29
            }
          ),
          /* @__PURE__ */ jsxDEV("span", { className: "font-medium text-sm", children: entry.username }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 54,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 48,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { children: entry.generated_count }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 56,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { children: entry.forked_count }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 57,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { children: entry.public_count }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 58,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-500", children: entry.last_activity ? new Date(entry.last_activity).toLocaleDateString() : "Never" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 25
        })
      ] }, entry.user_id, true, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 21
      }))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 36,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 34,
    columnNumber: 9
  });
};
var stdin_default = LeaderboardTab;
export {
  stdin_default as default
};
