import { forwardRef } from "react";
import type { Reflection } from "../../App";

interface StoryPreviewProps {
  reflections: Reflection[];
  template: "minimal" | "elegant" | "bold";
  userName?: string;
}

export const StoryPreview = forwardRef<HTMLDivElement, StoryPreviewProps>(
  ({ reflections, template, userName }, ref) => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (template === "minimal") {
      return (
        <div
          ref={ref}
          style={{
            width: "1080px",
            height: "1920px",
            backgroundColor: "#ffffff",
            padding: "96px",
            display: "flex",
            flexDirection: "column",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            color: "#0a0a0a",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div
              style={{
                fontSize: "90px",
                marginBottom: "24px",
                color: "#0a0a0a",
                fontFamily: "cooper"
              }}
            >
              2025
            </div>
            <div style={{ fontSize: "48px", color: "#525252" }}>
              Reflections
            </div>
            {userName && (
              <div
                style={{
                  fontSize: "36px",
                  color: "#a3a3a3",
                  marginTop: "32px",
                }}
              >
                {userName}
              </div>
            )}
          </div>

          {/* Reflections */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "64px",
            }}
          >
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                style={{ borderLeft: "4px solid #0a0a0a", paddingLeft: "40px" }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    color: "#737373",
                    marginBottom: "16px",
                  }}
                >
                  {reflection.topic}
                </div>
                <div
                  style={{
                    fontSize: "36px",
                    color: "#0a0a0a",
                    marginBottom: "24px",
                    lineHeight: "1.375",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {reflection.text}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              fontSize: "28px",
              color: "#a3a3a3",
              marginTop: "64px",
            }}
          >
            Thrive
          </div>
        </div>
      );
    }

    // if (template === "elegant") {
    //   return (
    //     <div
    //       ref={ref}
    //       style={{
    //         width: "1080px",
    //         height: "1920px",
    //         background: "linear-gradient(to bottom right, #fafafa, #f5f5f5)",
    //         padding: "96px",
    //         display: "flex",
    //         flexDirection: "column",
    //         position: "relative",
    //         fontFamily:
    //           'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    //         color: "#0a0a0a",
    //       }}
    //     >
    //       {/* Decorative Elements */}
    //       <div
    //         style={{
    //           position: "absolute",
    //           top: 0,
    //           left: 0,
    //           width: "100%",
    //           height: "384px",
    //           background:
    //             "linear-gradient(to bottom, rgba(10, 10, 10, 0.05), transparent)",
    //         }}
    //       />

    //       {/* Header */}
    //       <div
    //         style={{
    //           textAlign: "center",
    //           marginBottom: "80px",
    //           position: "relative",
    //           zIndex: 1,
    //         }}
    //       >
    //         <div
    //           style={{
    //             fontSize: "72px",
    //             marginBottom: "16px",
    //             color: "#0a0a0a",
    //           }}
    //         >
    //           My 2025 Reflections
    //         </div>
    //         {userName && (
    //           <div
    //             style={{
    //               fontSize: "36px",
    //               color: "#525252",
    //               marginTop: "24px",
    //             }}
    //           >
    //             {userName}
    //           </div>
    //         )}
    //       </div>

    //       {/* Reflections */}
    //       <div
    //         style={{
    //           flex: 1,
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: "48px",
    //           position: "relative",
    //           zIndex: 1,
    //         }}
    //       >
    //         {reflections.map((reflection) => (
    //           <div
    //             key={reflection.id}
    //             style={{
    //               backgroundColor: "#ffffff",
    //               borderRadius: "24px",
    //               padding: "48px",
    //               boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    //             }}
    //           >
    //             <div
    //               style={{
    //                 fontSize: "28px",
    //                 color: "#737373",
    //                 marginBottom: "24px",
    //               }}
    //             >
    //               {reflection.topic}
    //             </div>
    //             <div
    //               style={{
    //                 fontSize: "36px",
    //                 color: "#0a0a0a",
    //                 marginBottom: "32px",
    //                 lineHeight: "1.625",
    //                 whiteSpace: "pre-wrap",
    //                 wordBreak: "break-word",
    //                 overflowWrap: "break-word",
    //               }}
    //             >
    //               "{reflection.text}"
    //             </div>
    //             <div
    //               style={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "space-between",
    //                 paddingTop: "24px",
    //                 borderTop: "1px solid #e5e5e5",
    //               }}
    //             >
    //               <div style={{ fontSize: "28px", color: "#525252" }}>
    //                 Self-rating
    //               </div>
    //               <div style={{ fontSize: "48px", color: "#0a0a0a" }}>
    //                 {reflection.rating}/10
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Footer */}
    //       <div
    //         style={{
    //           textAlign: "center",
    //           fontSize: "28px",
    //           color: "#737373",
    //           marginTop: "64px",
    //           position: "relative",
    //           zIndex: 1,
    //         }}
    //       >
    //         {currentDate}
    //       </div>
    //     </div>
    //   );
    // }

    // Bold template
    return (
      <div
        ref={ref}
        style={{
          width: "1080px",
          height: "1920px",
          backgroundColor: "#110926",
          color: "#ffffff",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "80px" }}>
          <div
            style={{
              fontSize: "100px",
              marginBottom: "16px",
              color: "#ffffff",
            }}
          >
            2025
          </div>
          <div style={{ fontSize: "40px", color: "#a3a3a3" }}>REFLECTIONS</div>
        </div>

        {/* Reflections */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "56px",
          }}
        >
          {reflections.map((reflection, index) => (
            <div key={reflection.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "32px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ fontSize: "72px", color: "#525252" }}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "28px",
                      color: "#a3a3a3",
                      marginBottom: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",
                    }}
                  >
                    {reflection.topic}
                  </div>
                  <div
                    style={{
                      fontSize: "36px",
                      lineHeight: "1.375",
                      color: "#ffffff",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {reflection.text}
                  </div>
                </div>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  paddingLeft: "128px",
                }}
              >
                <div style={{ fontSize: "48px", color: "#ffffff" }}>
                  {reflection.rating}
                </div>
                <div style={{ fontSize: "28px", color: "#737373" }}>/10</div>
                <div
                  style={{
                    flex: 1,
                    height: "12px",
                    backgroundColor: "#262626",
                    borderRadius: "9999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#ffffff",
                      width: `${(reflection.rating / 10) * 100}%`,
                    }}
                  />
                </div>
              </div> */}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: "28px",
            color: "#525252",
            marginTop: "64px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Thrive
        </div>
      </div>
    );
  }
);

StoryPreview.displayName = "StoryPreview";
