import { Footer, Header } from "@/components/layout";
import { Container } from "@/components/ui";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex-1 py-10">
        <Container>{children}</Container>
      </main>
      <Footer />
    </>
  );
}
