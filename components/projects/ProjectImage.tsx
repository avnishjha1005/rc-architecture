import { getImageProps } from "next/image";
import type { ComponentProps } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { SitePicture } from "@/components/ui/SitePicture";

type ProjectImageProps = ComponentProps<typeof ResponsiveImage> & { mobileSrc?: string; mobileSizes?: string };

export function ProjectImage({ mobileSrc, mobileSizes = "calc(100vw - 40px)", ...props }: ProjectImageProps) {
  const image = <ResponsiveImage {...props} />;
  if (!mobileSrc) return image;
  const mobile = getImageProps({ src: mobileSrc, alt: "", fill: true, quality: props.quality, sizes: mobileSizes });
  return <SitePicture breakpoint={760} mobileSrcSet={mobile.props.srcSet} mobileSizes={mobileSizes}
    mobileImage={<ResponsiveImage {...props} image={{ src: mobileSrc, alt: props.image.alt }} sizes={mobileSizes} />}
  >{image}</SitePicture>;
}
