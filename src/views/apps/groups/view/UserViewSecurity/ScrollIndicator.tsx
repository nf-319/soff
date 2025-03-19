import { Box, Typography } from "@mui/material"
import { ArrowLeftRight } from "lucide-react"

interface ScrollIndicatorProps {
  message: string
  isDark: boolean
  direction?: "horizontal" | "vertical"
}

export const ScrollIndicator = ({ message, isDark, direction = "horizontal" }: ScrollIndicatorProps) => {
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 12px",
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
        borderRadius: "8px",
        marginBottom: "12px",
        gap: "8px",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          animation: direction === "horizontal" ? "swipeHorizontal 2s infinite" : "swipeVertical 2s infinite",
          "@keyframes swipeHorizontal": {
            "0%": { transform: "translateX(-10px)" },
            "50%": { transform: "translateX(10px)" },
            "100%": { transform: "translateX(-10px)" },
          },
          "@keyframes swipeVertical": {
            "0%": { transform: "translateY(-10px)" },
            "50%": { transform: "translateY(10px)" },
            "100%": { transform: "translateY(-10px)" },
          },
        }}
      >
        <ArrowLeftRight size={18} />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          fontSize: "0.875rem",
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}

