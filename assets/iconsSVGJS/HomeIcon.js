import * as React from "react";
import Svg, { Path } from "react-native-svg";

const HomeIcon = (props) => (
  <Svg
    width={props.width}
    height={props.height}
    viewBox="0 0 24 24"
    fill={props.fill}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8.99956 22L8.74893 18.4911C8.61418 16.6046 10.1083 15 11.9996 15C13.8909 15 15.385 16.6046 15.2502 18.4911L14.9996 22"
      stroke={props.stroke || "white"}
      strokeWidth={1.5}
    />
    <Path
      d="M2.35163 13.2135C1.99861 10.9162 1.8221 9.76763 2.25641 8.74938C2.69071 7.73112 3.65427 7.03443 5.58138 5.64106L7.02123 4.6C9.41853 2.86667 10.6172 2 12.0003 2C13.3833 2 14.582 2.86667 16.9793 4.6L18.4191 5.64106C20.3463 7.03443 21.3098 7.73112 21.7441 8.74938C22.1784 9.76763 22.0019 10.9162 21.6489 13.2135L21.3479 15.1724C20.8474 18.4289 20.5972 20.0572 19.4293 21.0286C18.2614 22 16.5539 22 13.1391 22H10.8615C7.44658 22 5.73915 22 4.57124 21.0286C3.40333 20.0572 3.15311 18.4289 2.65267 15.1724L2.35163 13.2135Z"
      stroke={props.stroke || "white"}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </Svg>
);

export default HomeIcon;