import Link from "next/link";

type Props = {
  variant?: "light" | "dark";
};

export default function SiteFooter({ variant = "light" }: Props) {
  const textColour =
    variant === "dark" ? "text-gray-400" : "text-gray-500";
  const linkColour =
    variant === "dark"
      ? "hover:text-gray-100"
      : "hover:text-gray-900";

  return (
    <footer
      className={`border-t py-6 ${
        variant === "dark"
          ? "border-gray-800 bg-gray-900"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className={`text-sm ${textColour}`}>
          © {new Date().getFullYear()} TaskForge. All rights reserved.
        </p>
        <nav
          className={`flex items-center gap-4 text-sm ${textColour}`}
          aria-label="Legal links"
        >
          <Link href="/privacy" className={linkColour}>
            Privacy
          </Link>
          <Link href="/terms" className={linkColour}>
            Terms
          </Link>
          <a
            href="mailto:cstuart756@gmail.com"
            className={linkColour}
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}