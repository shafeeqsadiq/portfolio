import Image from "next/image";
import { socialLinks } from "./config";

export default function Page() {
  return (
    <section>
      <a href={socialLinks.twitter} target="_blank">
        <Image
          src="/image.jpg"
          alt="Profile photo"
          className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0"
          unoptimized
          width={160}
          height={160}
          priority
        />
      </a>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">
      hi there!
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
        I'm Shafeeq Sadiq, a Computer Science graduate student at Saint Louis University.

        </p>
        <p>
        I aim to build technology that solves real-world challenges.
        </p>
        <p>
        My journey involves exploring Al, cloud systems, and data analytics where I thrive on transforming ideas into meaningful solutions. Building novel applications excites me, especially when it involves exploring machine learning and deep learning. I’ve been focused on developing software applications and computer vision solutions, leveraging technologies like PyTorch, NumPy, Node.js, React, and SQL.
        </p>
        <p>
        Outside of code, I love diving into hackathons, staying curious about emerging tools, and collaborating with others who share a vision for innovation.
        </p>
        <p>
        Let's connect and chat about building the future, one line of code at a time!
        </p>
      </div>
    </section>
  );
}
