import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-border text-muted-foreground border-t py-6 text-sm">
      <Container>
        © {new Date().getFullYear()} {siteConfig.name}
      </Container>
    </footer>
  );
}
