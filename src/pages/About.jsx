"use client";

import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "../components/LoadingSpinner";

const toDirectWikiaImage = (url) => {
  if (!url) return null;
  return url.split("/revision")[0];
};

const About = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/api/twice/members");
        const data = await res.json();

        const membersArray = Object.entries(data).map(
          ([stageName, member]) => ({
            stageName,
            ...member,
          })
        );
        setMembers(membersArray);
      } catch (err) {
        console.error("Fetch TWICE members failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="bg-black text-white min-h-screen py-24">
        {/* Wrapper / "container" */}
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

          <a
            href="https://www.youtube.com/c/TWICE"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-red-600 font-extrabold text-lg hover:underline"
          >
            TWICE Official YouTube Channel
          </a>

          <h2 className="text-center text-white font-extrabold text-xl md:text-2xl">
            Follow TWICE Members on Instagram
          </h2>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
            {members.map((member) => {
              const imageUrl = toDirectWikiaImage(member.images?.[0]);

              return (
                <div
                  key={member.stageName}
                  className="relative w-42 sm:w-44 md:w-59 lg:w-60 aspect-5/7 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
                >
                  {/* Gambar full card */}
                  <img
                    src={imageUrl || "/placeholder-avatar.png"}
                    alt={member.stageName}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay di bawah */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/90 via-black/90 to-transparent p-3 flex flex-col justify-between">
                    {/* Top content: Name + Position */}
                    <div className="flex flex-col items-center gap-1 text-center mt-15">
                      <p className="font-extrabold text-red-600 text-sm">
                        {member.stageName}
                      </p>

                      {member.position?.length > 0 && (
                        <p className="text-xs text-white/80">
                          {member.position.join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Bottom content: Instagram */}
                    {member.instagram?.length > 0 && (
                      <a
                        href={member.instagram[0]}
                        target="_blank"
                        className="flex items-center gap-2 text-white hover:text-red-600 text-xs justify-center"
                      >
                        <FaInstagram className="w-4 h-4" /> Instagram
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
