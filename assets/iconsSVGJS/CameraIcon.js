import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CameraIcon = (props) => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox="0 0 24 24"
    fill={props.fill}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M7.00024 6.00055C5.7796 6.00421 5.10407 6.03341 4.54897 6.2664C3.77144 6.59275 3.13825 7.19558 2.76835 7.96165C2.46642 8.58693 2.41702 9.38805 2.3182 10.9903L2.16336 13.501C1.91763 17.4854 1.79476 19.4776 2.96393 20.7388C4.13309 22 6.10277 22 10.0422 22H13.9584C17.8978 22 19.8674 22 21.0366 20.7388C22.2058 19.4776 22.0829 17.4854 21.8372 13.501L21.6823 10.9903C21.5835 9.38805 21.5341 8.58693 21.2322 7.96165C20.8623 7.19558 20.2291 6.59275 19.4516 6.2664C18.8965 6.03341 18.2209 6.00421 17.0003 6.00055"
      stroke={props.stroke || "white"}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M17 7L16.1142 4.78543C15.732 3.82996 15.3994 2.7461 14.4166 2.25955C13.8924 2 13.2616 2 12 2C10.7384 2 10.1076 2 9.58335 2.25955C8.6006 2.7461 8.26801 3.82996 7.88583 4.78543L7 7"
      stroke={props.stroke || "white"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.5 14C15.5 15.933 13.933 17.5 12 17.5C10.067 17.5 8.5 15.933 8.5 14C8.5 12.067 10.067 10.5 12 10.5C13.933 10.5 15.5 12.067 15.5 14Z"
      stroke={props.stroke || "white"}
      strokeWidth={1.5}
    />
    <Path
      d="M11.9998 6H12.0088"
      stroke={props.stroke || "white"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CameraIcon;