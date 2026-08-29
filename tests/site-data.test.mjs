import assert from "node:assert/strict";
import test from "node:test";
import site from "../content/site.json" with { type: "json" };

test("global navigation has unique, routable links", () => {
  const labels = site.navigation.map((item) => item.label);
  assert.equal(new Set(labels).size, labels.length);
  for (const item of site.navigation) {
    assert.ok(item.label.trim());
    assert.match(item.href, /^\/(?!\/)/);
    assert.notEqual(item.href, "#");
  }
});

test("global contact data is usable", () => {
  assert.match(site.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.match(site.phone, /^\+?[\d\s()-]+$/);
  assert.ok(site.address.length > 20);
  assert.ok(site.offices.length > 0);
});

test("social links cannot be placeholders", () => {
  for (const social of site.socialLinks) {
    assert.match(social.href, /^https:\/\//);
    assert.notEqual(social.href, "#");
  }
});
