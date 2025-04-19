import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { Fade } from "@mui/material";
import { Skeleton } from "antd";

// const SkeletonCard2 = ({ index, delay }) => {
//   const fadeOut = (index + 1) * delay;

//   return (
//     <Card
//       className="cursor-pointer flex flex-col h-full shadow-none"
//       style={{ borderRadius: "10%" }}
//     >
//       {/* Card Header with image placeholder */}
//       <CardHeader
//         shadow={false}
//         floated={false}
//         className="h-42 flex justify-center rounded"
//       >
//         <Fade in={true} timeout={{ enter: 0, exit: fadeOut }}>
//           <div
//             style={{
//               height: "180px",
//               width: "100%",
//               backgroundColor: "#f0f0f0",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               overflow: "hidden",
//             }}
//           >
//             <Skeleton.Avatar
//               active
//               size={120}
//               shape="square"
//               style={{
//                 borderRadius: "10%",
//                 backgroundColor: "#e0e0e0",
//                 width: "80%",
//                 height: "80%",
//               }}
//             />
//           </div>
//         </Fade>
//       </CardHeader>

//       {/* Card Body */}
//       <CardBody className="flex-grow py-2 overflow-hidden">
//         <div className="flex items-center justify-between mb-3 gap-2">
//           <div
//             className="mt-[2px] flex-grow"
//             style={{
//               overflow: "hidden",
//               width: "60%",
//             }}
//           >
//             <Skeleton.Input
//               active
//               size="default"
//               style={{
//                 width: "100%",
//                 height: "20px",
//                 maxWidth: "100%",
//               }}
//             />
//           </div>

//           <div
//             className="mt-[2px]"
//             style={{
//               width: "30%",
//               overflow: "hidden",
//             }}
//           >
//             <Skeleton.Input
//               active
//               size="default"
//               style={{
//                 width: "100%",
//                 height: "20px",
//                 maxWidth: "100%",
//               }}
//             />
//           </div>
//         </div>

//         {/* Description line */}
//         <div style={{ width: "90%", overflow: "hidden" }}>
//           <Skeleton.Input
//             active
//             size="small"
//             style={{
//               width: "100%",
//               maxWidth: "100%",
//             }}
//           />
//         </div>
//       </CardBody>

//       {/* Card Footer */}
//       <CardFooter className=" m-0 overflow-hidden">
//         <div className="flex flex-col justify-between w-full gap-2">
//           <div style={{ width: "50%", overflow: "hidden" }}>
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: "100%",
//                 maxWidth: "100%",
//               }}
//             />
//           </div>
//           <div style={{ width: "25%", overflow: "hidden" }}>
//             <Skeleton.Input
//               active
//               size="small"
//               style={{
//                 width: "100%",
//                 maxWidth: "100%",
//               }}
//             />
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default SkeletonCard2;

const SkeletonCard2 = ({ index, delay }) => {
  const fadeOut = (index + 1) * delay;
  return (
    <Card className="cursor-pointer flex flex-col h-full shadow-none">
      <div className="flex flex-col h-full">
        <CardHeader
          shadow={false}
          floated={false}
          className="h-44 rounded-xl overflow-hidden"
        >
          <Fade in={true} timeout={{ enter: 0, exit: fadeOut }}>
            <div
              style={{
                width: "100%", // Make it fill the width of the container
                height: "100%", // Make it fill the height of the container
                backgroundColor: "#e0e0e0", // Background color to simulate skeleton
                borderRadius: "12px", // Same border-radius as the CardHeader
              }}
            />
          </Fade>
        </CardHeader>

        <CardBody className="pt-2 pb-1 px-4 ">
          <div className="flex justify-between items-center">
            <Skeleton
              active
              paragraph={false} // Disables multiple lines, making it a single line
              style={{
                width: "40%", // Adjust the width to match the previous Typography width
                height: "20px", // Adjust the height to look like a single line
                // backgroundColor: "#e0e0e0", // Optional background color for visibility
              }}
              className="m-0 p-0"
            />

            <Skeleton
              active
              paragraph={false} // Disables multiple lines, making it a single line
              style={{
                width: "10%", // Adjust the width to match the previous Typography width
                height: "20px", // Adjust the height to look like a single line
                // backgroundColor: "#e0e0e0", // Optional background color for visibility
              }}
              className="m-0 p-0"
            />
          </div>

          <Skeleton
            active
            paragraph={false}
            style={{
              width: "60%",
              height: "5px",
              position: "relative",
              top: "6px", // Adjust this value as needed
            }}
            className="m-0"
          />
        </CardBody>
        <CardFooter className="flex flex-col py-0 mt-2">
          <div className="flex justify-between text-sm">
            {/* <span> */}
            <Skeleton
              active
              paragraph={false} // Disables multiple lines, making it a single line
              style={{
                width: "40%", // Adjust the width to match the previous Typography width
                height: "20px", // Adjust the height to look like a single line
                // backgroundColor: "#e0e0e0", // Optional background color for visibility
              }}
            />
            {/* </span> */}
            {/* <span> */}
            <Skeleton
              active
              paragraph={false} // Disables multiple lines, making it a single line
              style={{
                width: "10%", // Adjust the width to match the previous Typography width
                height: "20px", // Adjust the height to look like a single line
                // backgroundColor: "#e0e0e0", // Optional background color for visibility
              }}
            />
            {/* </span> */}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default SkeletonCard2;
