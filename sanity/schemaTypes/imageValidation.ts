import type { ImageRule, ImageValue } from "sanity";

export function minimumImageWidth(rule: ImageRule, minimumWidth: number, placement: string) {
  return rule.custom(async (image: ImageValue | undefined, context) => {
    const assetId = image?.asset?._ref;
    if (!assetId) return true;
    const client = context.getClient({ apiVersion: "2025-02-19" });
    const width = await client.fetch<number | null>("*[_id == $assetId][0].metadata.dimensions.width", { assetId });
    if (!width || width >= minimumWidth) return true;
    return `${placement} should be at least ${minimumWidth}px wide. This asset is ${width}px and may look soft.`;
  }).warning();
}
