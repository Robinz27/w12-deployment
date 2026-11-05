const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "TikTok", href: "https://www.tiktok.com/" },
  { name: "YouTube", href: "https://www.youtube.com/" },
  { name: "X", href: "https://x.com/" },
  { name: "Instagram", href: "https://www.instagram.com/" },
];

export default function Footer() {
  return (
    <footer className="mt-6 px-3 pb-4 text-center">
      <p className="inline-block rounded-md bg-blue-100 px-3 py-1.5 font-bold text-gray-800">
        68034768 รัตนตรัย โลซาเรส
      </p>

      <ul
        aria-label="Social media"
        className="mt-3 flex flex-wrap justify-center gap-y-2 text-sm"
      >
        {socialLinks.map(({ name, href }) => (
          <li
            key={name}
            className="border-r border-gray-300 px-2 last:border-r-0 sm:px-4"
          >
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:underline"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
