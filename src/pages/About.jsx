"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaInstagram } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import membersData from "@/data/twiceMembers.json";

const toDirectWikiaImage = (url) => {
  if (!url) return null;
  return url.split("/revision")[0];
};

const About = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const membersArray = Object.entries(membersData).map(
      ([stageName, member]) => ({
        stageName,
        ...member,
      }),
    );
    setMembers(membersArray);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading About - TWICEFLIX</title>
          <meta name="description" content="Loading TWICE information..." />
        </Helmet>
        <LoadingSpinner />
      </>
    );
  }

  const firstRow = members.slice(0, 5);
  const secondRow = members.slice(5);

  const MemberCard = ({ member }) => {
    const imageUrl = toDirectWikiaImage(member.images?.[0]);
    return (
      <div className="relative w-full lg:w-[200px] aspect-[5/7] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg flex-shrink-0">
        <img
          src={imageUrl || "/placeholder-avatar.png"}
          alt={member.stageName}
          className="w-full h-full object-cover"
        />
        {/* Gradient background */}
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none" />

        {/* Instagram: selalu fixed di bottom */}
        {member.instagram?.length > 0 && (
          <a
            href={member.instagram[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 left-0 w-full flex items-center gap-2 text-white hover:text-red-600 text-xs justify-center"
          >
            <FaInstagram className="w-4 h-4" /> Instagram
          </a>
        )}

        {/* Nama + Posisi: selalu tepat di atas Instagram */}
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

  return (
    <>
      <Helmet>
        <title>About - TWICEFLIX</title>
        <meta
          name="description"
          content="Learn about TWICE, the sensational K-pop girl group. Explore member profiles, Instagram accounts, and stay updated with their latest content on TWICEFLIX."
        />
      </Helmet>

      <div className="bg-black text-white min-h-screen py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <h1 className="text-center text-red-600 font-extrabold text-2xl md:text-4xl">
            About TWICEFLIX
          </h1>

          <p className="text-sm md:text-lg text-justify md:text-center">
            Welcome to TWICEFLIX! We are your ultimate source for all things
            related to the sensational K-pop girl group, TWICE. Here, you can
            explore an extensive collection of TWICE's YouTube videos, ranging
            from their latest music videos to behind-the-scenes content. Stay
            up-to-date with all the latest TWICE content and never miss a moment
            of their incredible performances and activities.
          </p>

          <div>
            <a
              href="https://www.youtube.com/c/TWICE"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-red-600 font-extrabold text-lg hover:underline"
            >
              TWICE Official YouTube Channel
            </a>
            <a
              href="https://www.youtube.com/@twicejapan_official"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-red-600 font-extrabold text-lg hover:underline"
            >
              TWICE Japan Official YouTube Channel
            </a>
          </div>

          <h2 className="text-center text-white font-extrabold text-xl md:text-2xl">
            Follow TWICE Members on Instagram
          </h2>

          {/* Mobile: 1 kolom */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {members.map((member) => (
              <MemberCard key={member.stageName} member={member} />
            ))}
          </div>

          {/* Tablet: 3 kolom, card w-full mengisi kolom */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 lg:hidden">
            {members.map((member) => (
              <MemberCard key={member.stageName} member={member} />
            ))}
          </div>

          {/* Desktop: baris 5 + baris 4 center */}
          <div className="hidden lg:flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              {firstRow.map((member) => (
                <MemberCard key={member.stageName} member={member} />
              ))}
            </div>
            {secondRow.length > 0 && (
              <div className="flex justify-center gap-4">
                {secondRow.map((member) => (
                  <MemberCard key={member.stageName} member={member} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
