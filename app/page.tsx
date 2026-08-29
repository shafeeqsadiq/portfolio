import Image from "next/image";
import { socialLinks } from "./config";
import { SiTypescript, SiPython, SiReact, SiNodedotjs, SiJavascript, SiPostgresql, SiPytorch, SiNumpy, SiOpencv } from "react-icons/si";

function TechBadge({ icon: Icon, name }: { icon: any, name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm font-mono text-neutral-800 dark:text-neutral-200 mx-0.5 selection:bg-transparent">
      <Icon className="w-3.5 h-3.5" />
      {name}
    </span>
  );
}

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
        <i className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-md">hi there!</i>
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          I'm Shafeeq Sadiq. I work as an AI Engineer at <a href="https://www.mylearningtools.org/" target="_blank" rel="noopener noreferrer" className="text-yellow-600 dark:text-yellow-500 font-medium hover:underline">Resilience, Inc.</a> and a Master's graduate from the Computer Science program at Saint Louis University.
        </p>
        <p>
          I have a passion for building novel applications that solve real-world challenges.
        </p>
        <p className="leading-relaxed">
          My journey involves building full-stack applications using <TechBadge icon={SiTypescript} name="TypeScript" />, <TechBadge icon={SiPython} name="Python" />, <TechBadge icon={SiReact} name="React" />, <TechBadge icon={SiNodedotjs} name="Node.js" />, <TechBadge icon={SiJavascript} name="JavaScript" />, and <TechBadge icon={SiPostgresql} name="PostgreSQL" />, where I enjoy taking an idea from concept to a fully working product. I get excited about solving real problems through clean architecture and thoughtful design across the entire stack. I have also worked with major cloud technologies alongside my full-stack experience, deploying and integrating cloud services into the applications I build. Beyond that, I have explored computer vision through various projects, working with tools like <TechBadge icon={SiPytorch} name="PyTorch" />, <TechBadge icon={SiNumpy} name="NumPy" />, and <TechBadge icon={SiOpencv} name="OpenCV" /> to incorporate visual intelligence in my applications.
        </p>
        <p>
          Outside of code, I love diving into hackathons, staying curious about emerging tools, and collaborating with others who share a vision for innovation.
        </p>
        <p>
          Let’s connect and chat if you’d like to collaborate or get to know me better!
        </p>
      </div>
    </section>
  );
}
