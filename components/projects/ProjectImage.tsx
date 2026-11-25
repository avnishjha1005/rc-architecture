import { getImageProps } from "next/image";
import type { ComponentProps } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { SitePicture } from "@/components/ui/SitePicture";
import type { ResponsiveImage as ResponsiveImageData } from "@/lib/responsive-image";
import { responsiveImageLoader } from "@/lib/responsive-image-loader";

type ProjectImageProps = ComponentProps<typeof ResponsiveImage> & {
  mobileSrc?: string;
  mobileSizes?: string;
  mobileAspectRatio?: number;
};

export function ProjectImage({ mobileSrc, mobileSizes = "calc(100vw - 40px)", mobileAspectRatio, ...props }: ProjectImageProps) {
  const mobileImage: ResponsiveImageData = mobileSrc ? { src: mobileSrc, alt: props.image.alt } : props.image;
  const image = <ResponsiveImage {...props} />;
  if (!mobileSrc && !mobileAspectRatio) return image;
  const mobile = getImageProps({
    src: mobileImage.src,
    alt: "",
    fill: true,
    quality: props.quality,
    sizes: mobileSizes,
    loader: responsiveImageLoader(mobileImage, mobileAspectRatio),
  });
  return <SitePicture breakpoint={760} mobileSrcSet={mobile.props.srcSet} mobileSizes={mobileSizes}
    mobileImage={<ResponsiveImage {...props} image={mobileImage} aspectRatio={mobileAspectRatio} sizes={mobileSizes} />}
  >{image}</SitePicture>;
}
