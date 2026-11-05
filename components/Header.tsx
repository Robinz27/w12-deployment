import { Badge } from "@/components/tailgrids/core/badge";

export default function Header() {
  return (
    <header className="mt-4 text-center">
      <div className="flex justify-center gap-3 sm:gap-4">
        <Badge className="rotate-6 rounded-md bg-red-500 px-4 py-2 text-3xl font-bold text-white">
          C
        </Badge>

        <Badge className="-rotate-6 rounded-md bg-green-600 px-4 py-2 text-3xl font-bold text-white">
          S
        </Badge>

        <Badge className="rotate-6 rounded-md bg-blue-600 px-4 py-2 text-3xl font-bold text-white">
          I
        </Badge>

        <Badge className="-rotate-6 rounded-md bg-cyan-500 px-4 py-2 text-3xl font-bold text-white">
          2
        </Badge>

        <Badge className="rotate-6 rounded-md bg-yellow-400 px-4 py-2 text-3xl font-bold text-white">
          0
        </Badge>

        <Badge className="-rotate-6 rounded-md bg-gray-500 px-4 py-2 text-3xl font-bold text-white">
          5
        </Badge>
      </div>

      <div className="mx-auto mt-2 inline-block rounded bg-slate-800 px-4 py-1.5 text-sm font-bold tracking-wide text-white sm:text-base">
        FRONT END SOFTWARE DEVELOPMENT
      </div>
    </header>
  );
}
