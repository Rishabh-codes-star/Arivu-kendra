import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/Section";
import { OrgGrid } from "@/components/OrgGrid";
import { booksByOrg, getOrgs } from "@/lib/catalog";
import { orgImage } from "@/lib/images";

export const metadata: Metadata = { title: "Organizations" };

export default function OrganizationsPage() {
  const orgs = getOrgs();
  const images = Object.fromEntries(orgs.map((o) => [o.slug, orgImage(o.slug)]));
  const counts = Object.fromEntries(orgs.map((o) => [o.slug, booksByOrg(o.slug).length]));
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Content providers"
        title="Partner organizations"
        subtitle="The Department of Rural Development and Panchayat Raj has partnered with organizations already working in Karnataka's villages, schools and libraries. Their collections are published here under their own names."
      />
      <OrgGrid orgs={orgs} images={images} counts={counts} />
    </Container>
  );
}
