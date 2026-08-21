import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "homePage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Homepage")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ""),
      ),
    ]);
