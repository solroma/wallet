import Svg, { Path } from 'react-native-svg';

import type { SvgProps } from 'react-native-svg';

const SvgSettings = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" accessibilityRole="image" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M9.785 3.185a2.662 2.662 0 0 1 4.43 0l.556.835c.225.337.636.5 1.031.409l.686-.158a2.703 2.703 0 0 1 3.241 3.24l-.158.687a.976.976 0 0 0 .41 1.031l.834.556a2.662 2.662 0 0 1 0 4.43l-.835.556a.976.976 0 0 0-.409 1.031l.158.686a2.703 2.703 0 0 1-3.24 3.241l-.687-.158a.976.976 0 0 0-1.031.41l-.556.834a2.662 2.662 0 0 1-4.43 0l-.556-.835a.976.976 0 0 0-1.031-.409l-.686.158a2.703 2.703 0 0 1-3.241-3.24l.158-.687a.976.976 0 0 0-.41-1.031l-.834-.556a2.662 2.662 0 0 1 0-4.43l.835-.556a.976.976 0 0 0 .409-1.031l-.158-.686A2.703 2.703 0 0 1 7.51 4.27l.687.158a.976.976 0 0 0 1.031-.41l.556-.834ZM8.5 12a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgSettings;