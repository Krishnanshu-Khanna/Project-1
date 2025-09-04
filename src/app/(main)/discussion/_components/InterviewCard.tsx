import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "action.ts";
import { Button } from "@/components/ui/button";

type InterviewCardProps = {
  interviewId: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string | number | Date;
};

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("MMM D, YYYY");

  return (
    <div className="card-border min-h-96 w-[360px] max-sm:w-full">
      <div className="card-interview">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute right-0 top-0 w-fit rounded-bl-lg px-4 py-2",
              badgeColor,
            )}
          >
            <p className="badge-text">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="object-fit size-[90px] rounded-full"
          />

          {/* Interview Role */}
          <h3 className="mt-5 capitalize">{role} Interview</h3>

          {/* Date & Score */}
          <div className="mt-3 flex flex-row gap-5">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="mt-5 line-clamp-2">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
