import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "./_components/InterviewCard";

import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "action.ts";
import { currentUser } from "@clerk/nextjs/server";

async function Home() {
    const user = await currentUser();

  if (!user?.id) {
    // Handle the case where user is not authenticated or id is missing
    return (
      <div className="flex items-center justify-center h-full">
        <p>You must be signed in to view your interviews.</p>
      </div>
    );
  }

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = Array.isArray(userInterviews) && userInterviews.length > 0;
  const hasUpcomingInterviews = Array.isArray(allInterview) && allInterview.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex max-w-lg flex-col gap-6">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
