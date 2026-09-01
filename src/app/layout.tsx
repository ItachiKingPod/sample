import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hello world",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
