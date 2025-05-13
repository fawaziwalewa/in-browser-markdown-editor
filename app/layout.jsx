import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

export const metadata = {
  title: "In-Browser Markdown Editor",
  description: "Frontend Mentor Challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${robotoSlab.className} flex h-screen group antialiased dark:bg-neutral-1000`}
      >
        {children}
      </body>
    </html>
  );
}
