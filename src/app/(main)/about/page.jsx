"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import membersData from "./_data/twiceMembers.json";
import ProfileCard from "@/app/(main)/about/_components/ProfileCard";

gsap.registerPlugin(ScrollTrigger);

const toDirectWikiaImage = (url) => {
  if (!url) return null;
  return url.split("/revision")[0];
};

const MemberCard = ({ member, index }) => {
  const imageUrl = toDirectWikiaImage(member.images?.[0]);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      },
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative w-full lg:w-[200px] aspect-[5/7] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg flex-shrink-0"
    >
      <img
        src={imageUrl || "/placeholder-avatar.png"}
        alt={member.stageName}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none" />

      {member.instagram?.length > 0 && (
        <div
          onClick={() => window.open(member.instagram[0], "_blank")}
          className="absolute bottom-2 left-0 w-full flex items-center gap-2 text-white hover:text-red-600 text-xs justify-center cursor-pointer"
        >
          <FaInstagram className="w-4 h-4" /> Instagram
        </div>
      )}

      <div className="absolute bottom-8 left-0 w-full flex flex-col items-center gap-0.5 text-center px-2">
        <p className="font-extrabold text-red-600 text-sm leading-tight">
          {member.stageName}
        </p>
        {member.position?.length > 0 && (
          <p className="text-xs text-white/80 leading-tight">
            {member.position.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

const About = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const linksRef = useRef(null);
  const membersTitleRef = useRef(null);
  const creditRef = useRef(null);

  const members = Object.entries(membersData).map(([stageName, member]) => ({
    stageName,
    ...member,
  }));

  const firstRow = members.slice(0, 5);
  const secondRow = members.slice(5);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6 },
    )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3",
      )
      .fromTo(
        linksRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2",
      );

    gsap.fromTo(
      membersTitleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: membersTitleRef.current,
          start: "top 90%",
        },
      },
    );

    gsap.fromTo(
      ".credit-title",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: creditRef.current,
          start: "top 85%",
        },
      },
    );

    gsap.fromTo(
      ".credit-card",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: creditRef.current,
          start: "top 80%",
        },
      },
    );

    gsap.fromTo(
      ".credit-footer",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: creditRef.current,
          start: "top 80%",
        },
      },
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.08),_transparent_70%)] pointer-events-none" />
        <p className="text-xs tracking-[0.3em] text-red-600 uppercase mb-3">
          Fan Platform
        </p>
        <img
          ref={titleRef}
          src="/logo/twiceflix.svg"
          alt="TWICEFLIX"
          className="h-16 md:h-24 w-auto my-4"
        />
        <p
          ref={descRef}
          className="max-w-xl text-sm md:text-base text-neutral-400 leading-relaxed"
        >
          Your ultimate source for all things TWICE — music videos,
          behind-the-scenes, performances, and more. All in one place.
        </p>

        {/* Links */}
        <div ref={linksRef} className="flex flex-col sm:flex-row gap-3 mt-8">
          <div
            onClick={() =>
              window.open("https://www.youtube.com/c/TWICE", "_blank")
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700 hover:border-white hover:text-white text-sm text-neutral-300 transition-all cursor-pointer"
          >
            <FaYoutube className="w-4 h-4 text-red-600" />
            TWICE Official
          </div>
          <div
            onClick={() =>
              window.open(
                "https://www.youtube.com/@twicejapan_official",
                "_blank",
              )
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700 hover:border-white hover:text-white text-sm text-neutral-300 transition-all cursor-pointer"
          >
            <FaYoutube className="w-4 h-4 text-red-600" />
            TWICE Japan Official
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div ref={membersTitleRef} className="mb-10 text-center">
          <p className="text-xs tracking-[0.3em] text-red-600 uppercase mb-2">
            The Group
          </p>
          <h2 className="text-2xl md:text-3xl font-black">Meet the Members</h2>
        </div>

        {/* Mobile: 2 cols */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {members.map((member, i) => (
            <MemberCard key={member.stageName} member={member} index={i} />
          ))}
        </div>

        {/* Tablet: 3 cols */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 lg:hidden">
          {members.map((member, i) => (
            <MemberCard key={member.stageName} member={member} index={i} />
          ))}
        </div>

        {/* Desktop: 5 + 4 rows */}
        <div className="hidden lg:flex flex-col items-center gap-4">
          <div className="flex justify-center gap-4">
            {firstRow.map((member, i) => (
              <MemberCard key={member.stageName} member={member} index={i} />
            ))}
          </div>
          {secondRow.length > 0 && (
            <div className="flex justify-center gap-4">
              {secondRow.map((member, i) => (
                <MemberCard
                  key={member.stageName}
                  member={member}
                  index={i + 5}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Credit */}
      <div ref={creditRef} className="border-t border-neutral-800 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="credit-title text-center">
            <p className="text-xs tracking-[0.3em] text-red-600 uppercase mb-2">
              Developer
            </p>
            <h2 className="text-2xl md:text-3xl font-black">
              Made by a ONCE, for ONCEs
            </h2>
          </div>

          <div className="credit-card">
            <ProfileCard
              name="RAPSIGN"
              title="ONCE"
              handle="rapsign"
              status="Online"
              contactText="Visit Portfolio"
              avatarUrl="/rapsign.webp"
              showUserInfo={true}
              enableTilt={true}
              iconUrl="/logo/twice.svg"
              enableMobileTilt={false}
              onContactClick={() =>
                window.open("https://rinaldi-a-prayuda.vercel.app/", "_blank")
              }
              behindGlowColor="rgba(220, 38, 38, 0.4)"
              behindGlowEnabled
              innerGradient="linear-gradient(145deg,#3b000080 0%,#dc262644 100%)"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center py-6 gap-6">
          <p className="credit-footer text-neutral-700 text-xs">
            &copy; {new Date().getFullYear()} TWICEFLIX. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
