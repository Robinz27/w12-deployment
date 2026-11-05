import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "รัตนตรัย โลซาเรส | CSI205",
  description: "โปรไฟล์นักศึกษาและเป้าหมายด้าน Software Engineering",
};

export default function HomePage() {
  return (
    <section
      className="mx-auto max-w-5xl px-4 pb-4 sm:px-6"
      aria-labelledby="profile-name"
    >
      <div className="grid items-center gap-8 rounded-[2rem] border border-white/10 bg-linear-to-br from-[#181327] via-[#211832] to-[#332043] p-5 text-white shadow-xl shadow-violet-950/15 sm:p-8 md:grid-cols-[1.15fr_1fr] lg:gap-12 lg:p-10">
        <div className="px-1 py-3 sm:px-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-pink-200/30 bg-pink-300/10 px-3 py-1 text-xs font-semibold tracking-widest text-pink-100">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-pink-300"
            />
            STUDENT PROFILE
          </p>

          <h1
            id="profile-name"
            className="mt-5 text-3xl leading-tight font-bold sm:text-5xl"
          >
            รัตนตรัย โลซาเรส
          </h1>

          <dl className="mt-6 space-y-4 border-t border-white/15 pt-5">
            <div>
              <dt className="text-sm font-medium text-violet-200">
                รหัสนักศึกษา
              </dt>
              <dd className="mt-1 font-mono text-xl tracking-wider">
                68034768
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-violet-200">สาขาวิชา</dt>
              <dd className="mt-1 text-base leading-relaxed text-white sm:text-lg">
                วิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl border border-pink-200/20 bg-white/5 px-4 py-3">
            <p className="text-sm font-medium text-pink-200">เป้าหมายอาชีพ</p>
            <p className="mt-1 leading-relaxed text-violet-50">
              อยากเป็นวิศวกรซอฟต์แวร์ในสาย{" "}
              <strong className="font-bold text-white">
                Software Engineering
              </strong>
            </p>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-sm rounded-[1.5rem] border border-white/20 bg-white/10 p-2 shadow-lg shadow-black/30">
          <Image
            src="/student-profile.png"
            alt="ภาพนักศึกษามหาวิทยาลัยศรีปทุมของรัตนตรัย โลซาเรส"
            width={1021}
            height={1001}
            sizes="(max-width: 430px) calc(100vw - 90px), 368px"
            className="h-auto w-full rounded-[1.1rem]"
            unoptimized
          />
        </figure>
      </div>
    </section>
  );
}
