"use client";

import { Card, CardContent, CardHeader } from "@ui/card.tsx";
import { Tag, Lock } from "lucide-react";
import Tags from "@ui/Tags.tsx";
import { useEffect, useState } from "react";
import config from "@shConfig";
import { CalendarDaysIcon } from "@ui/animated/calendar-days.tsx";

interface BlogCardProps {
  title: string;
  description?: string;
  pubDate: string; // ISO string from server
  heroImage?: string;
  href: string;
  isLoading?: boolean;
  category: string | string[] | null;
  tags: string[] | null;
  locked?: boolean;
}

export default function BlogCard({
  title,
  description,
  pubDate,
  heroImage,
  href,
  category,
  tags,
  locked = false,
  isLoading = false,
}: BlogCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const date = new Date(pubDate);
    setFormattedDate(
      date.toLocaleDateString(config.lang || "zh-Hant", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
    setIsHydrated(true);
  }, [pubDate]);

  const handleCardClick = () => {
    window.location.href = href;
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleCardClick} className="block cursor-pointer">
      <Card
        className={`backdrop-blur-[10px] min-h-110 border border-white/10 rounded-[14px] transition-all hover:border-white/20 p-0 gap-3 overflow-hidden ${
          isLoading ? "bg-neutral-800" : "bg-neutral-900"
        } flex flex-col h-full relative group`}
      >
        {/* 背景圖層 */}
        {!isLoading && heroImage && (
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[14px]">
            <img
              src={heroImage}
              alt=""
              role="presentation"
              className="w-full h-full object-cover opacity-10 group-hover:opacity-15 blur-[20px] group-hover:blur-[3px] scale-110 transition-all duration-300"
            />
          </div>
        )}

        <CardHeader className="p-0 pb-0 relative z-10">
          {/* Image */}
          <div className="h-50 overflow-hidden bg-neutral-700 relative">
            {!isLoading && heroImage && (
              <img
                src={heroImage}
                alt={title}
                className={`w-full h-full object-cover ${
                  locked ? "blur-sm scale-105" : ""
                }`}
              />
            )}
            {!isLoading && locked && (
              <>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Lock size={40} className="text-green-400" />
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-green-500/40 text-green-400 text-xs font-mono">
                  <Lock size={12} />
                  Activa
                </div>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2.5 p-6 pt-0 flex-1 relative z-10">
          {/* 主要內容區塊（flex-1 撐開空間） */}
          <div className="flex-1">
            {/* 文章分類 */}
            {category && (
              <div>
                <a
                  className="hover:text-white transition-all font-mono text-sm text-neutral-400"
                  href={`/blog/categories/${(Array.isArray(category) ? category[0] : category).toLowerCase()}`}
                  onClick={handleCategoryClick}
                >
                  <span className="tracking-[0.5em]">
                    {Array.isArray(category) ? category[0] : category}
                  </span>
                </a>
              </div>
            )}
            {/* Title */}
            <h3
              className={`text-xl font-bold leading-normal ${
                isLoading
                  ? "h-8 bg-neutral-700 rounded-md animate-pulse"
                  : "text-white"
              }`}
            >
              {!isLoading && title}
            </h3>
            {/* Description */}
            {!isLoading && description && (
              <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {/* Metadata - 固定放在底部 */}
          <div className="flex items-center gap-3 text-sm text-neutral-500 flex-wrap">
            {!isLoading && isHydrated ? (
              <>
                {/* 文章發表日期 */}
                <div className="flex items-center gap-1.5">
                  <CalendarDaysIcon size={16} />
                  <time dateTime={pubDate}>{formattedDate}</time>
                </div>

                {/* 文章標籤 */}
                {tags && (
                  <div
                    className="flex items-center gap-1.5"
                    onClick={handleCategoryClick}
                  >
                    <Tag size={16} />
                    <Tags tags={tags} />
                  </div>
                )}
              </>
            ) : isLoading ? (
              <div className="h-5 w-32 bg-neutral-700 rounded-md animate-pulse" />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
