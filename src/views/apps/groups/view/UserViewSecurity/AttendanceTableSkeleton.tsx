import { Box, Skeleton } from "@mui/material"
import { FC } from 'react'

type Props = {
  isDark: boolean
}

export const AttendanceTableSkeleton: FC<Props> = ({ isDark }) => {
  return (
    <Box style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          tableLayout: 'fixed',
          borderCollapse: "collapse",
          backgroundColor: isDark ? "#282A42" : "#fff",
          minWidth: "768px",
        }}
      >
        <thead>
        <tr>
          <td
            style={{
              position: "sticky",
              left: 0,
              background: isDark ? "#1e2035" : "#f5f5f5",
              zIndex: 2,
              padding: "12px 20px",
              width: "200px",
              borderBottom: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
              borderRight: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
            }}
          >
            <Skeleton variant="text" width={120} height={24} />
          </td>
          {[...Array(10)].map((_, i) => (
            <td
              key={i}
              style={{
                padding: "12px 8px",
                width: "60px",
                minWidth: '60px',
                maxWidth: '60px',
                borderBottom: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                borderRight: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
              }}
            >
              <Skeleton variant="text" width={40} height={24} />
            </td>
          ))}
        </tr>
        <tr>
          <td
            style={{
              position: "sticky",
              left: 0,
              background: isDark ? "#1e2035" : "#f5f5f5",
              zIndex: 2,
              padding: "12px 20px",
              width: "200px",
              borderBottom: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
              borderRight: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
            }}
          >
            <Skeleton variant="text" width={120} height={24} />
          </td>
          {[...Array(10)].map((_, i) => (
            <td
              key={i}
              style={{
                padding: "12px 8px",
                width: "60px",
                backgroundColor: isDark ? "#2a3246" : "#e6f0fa",
                borderBottom: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                borderRight: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
              }}
            >
              <Skeleton variant="text" width={40} height={24} />
            </td>
          ))}
        </tr>
        </thead>
        <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            <td
              style={{
                position: "sticky",
                left: 0,
                background: isDark ? "#282A42" : "#fff",
                zIndex: 2,
                padding: "12px 20px",
                borderBottom: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                borderRight: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
              }}
            >
              <Skeleton variant="text" width={150} height={24} />
            </td>
            {[...Array(10)].map((_, j) => (
              <td
                key={j}
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  borderBottom: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                  borderRight: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                }}
              >
                <Skeleton variant="circular" width={24} height={24} style={{ margin: "0 auto" }} />
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </Box>
  )
}

