const presentation = ["display", "position", "inset", "width", "height", "box-sizing", "margin", "padding", "gap", "grid-template-columns", "flex-direction", "align-items", "align-self", "justify-content", "place-content", "color", "background-color", "border", "border-radius", "font", "letter-spacing", "text-transform", "text-decoration", "white-space", "object-fit", "object-position", "transform", "opacity"];

export function navbarStill(header: HTMLElement) {
  const view = header.ownerDocument.defaultView!;
  function copy(source: Element): HTMLElement | SVGSVGElement | null {
    if (!source.getClientRects().length) return null;
    const style = view.getComputedStyle(source);
    if (source.localName === "svg") {
      const svg = document.importNode(source, true) as SVGSVGElement;
      svg.removeAttribute("class");
      svg.style.display = style.display;
      svg.style.width = style.width;
      svg.style.height = style.height;
      return svg;
    }
    const node = document.createElement(source.tagName === "IMG" ? "img" : "div");
    for (const property of presentation) node.style.setProperty(property, style.getPropertyValue(property));
    if (node instanceof HTMLImageElement) {
      const image = source as HTMLImageElement;
      node.src = image.currentSrc || image.src;
      node.alt = "";
    } else {
      for (const child of source.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) node.append(child.textContent || "");
        else if (child.nodeType === Node.ELEMENT_NODE) {
          const visible = copy(child as Element);
          if (visible) node.append(visible);
        }
      }
      if (source.matches('[aria-current="page"]')) node.style.textDecoration = "underline";
    }
    return node;
  }
  const still = copy(header) as HTMLElement;
  still.className = "rc-review-navbar";
  still.setAttribute("aria-hidden", "true");
  still.inert = true;
  return still;
}
