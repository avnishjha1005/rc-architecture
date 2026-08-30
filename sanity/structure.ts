import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "homePage", "projectsPage", "aboutPage", "servicesPage", "clientsPage", "contactPage", "blogPage"]);

const singleton = (S: Parameters<StructureResolver>[0], title: string, type: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "Site settings", "siteSettings"),
      singleton(S, "Homepage", "homePage"),
      singleton(S, "About page", "aboutPage"),
      singleton(S, "Services page", "servicesPage"),
      singleton(S, "Projects page", "projectsPage"),
      singleton(S, "Clients page", "clientsPage"),
      singleton(S, "Blog page", "blogPage"),
      singleton(S, "Contact page", "contactPage"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ""),
      ),
    ]);
