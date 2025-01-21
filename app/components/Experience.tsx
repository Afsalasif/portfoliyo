import React from "react";
import { Timeline } from "./ui/Timeline";

const Experience: React.FC = () => {
  const data = [
    {
      title: "2023-2024",
      content: (
        <div>
          <p className="text-white uppercase dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Software engineer - rp royality pvt ltd
          </p>
          <p className="text-white dark:text-neutral-200 text-xs text-left  md:text-sm md:text-justify md:font-normal mb-8">
            Led the development of a cab booking system using Next.js, React,
            Node.js, and Tailwind CSS, creating a modern, user-friendly
            interface with seamless responsiveness across devices. Designed and
            implemented core features such as real-time cab availability,
            booking workflows, and route management to streamline the user
            journey. Built and maintained backend services with Node.js,
            ensuring secure user authentication, efficient ride scheduling, and
            reliable payment processing through REST APIs. Actively debugged and
            maintained the application to ensure high performance, reliability,
            and smooth functionality during critical use cases. Collaborated
            closely with stakeholders to translate business requirements into
            technical implementations, delivering key system updates within
            tight deadlines. Utilized data-driven insights to improve the user
            experience and ensure the platform consistently met user
            expectations. Authored detailed technical documentation and
            supported junior developers to maintain the application &apos s
            continuity and future scalability. Key Highlights: Designed and
            deployed a scalable architecture to support increasing system demand
            while maintaining optimal performance. Ensured the cab booking
            system adhered to industry-standard practices for security and
            usability. Contributed to troubleshooting and resolving technical
            issues, reducing downtime and ensuring smooth day-to-day operations.
          </p>
        </div>
      ),
    },
    {
      title: " 2022-2024",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-xs md:text-sm uppercase font-bold mb-8">
            Software engineer - trizent pvt ltd
          </p>
          <p className="text-white dark:text-neutral-200 text-xs text-left  md:text-sm md:text-justify md:font-normal mb-8">
            Developed and maintained scalable, feature-rich web applications
            using React.js, implementing interactive and dynamic user interfaces
            with a strong focus on performance and usability. Leveraged Redux
            for efficient state management across complex applications, ensuring
            seamless data flow and predictable application behavior. Architected
            reusable and modular React components, reducing development time and
            enabling code reusability across multiple projects. Optimized
            application performance through code splitting, lazy loading, and
            minimizing unnecessary renders using advanced React lifecycle
            methods. Integrated with RESTful APIs and third-party libraries,
            ensuring smooth and secure data interactions for robust application
            functionality. Worked extensively with Redux Thunk and middleware to
            handle complex asynchronous workflows, including API calls and side
            effects. Collaborated with product managers, designers, and backend
            developers in an Agile development environment to deliver
            high-quality features on time. Conducted in-depth code reviews to
            ensure adherence to industry best practices and maintain a high
            standard of code quality. Debugged and resolved application bugs,
            ensuring consistent functionality and reliability across different
            browsers and devices. Focused on responsive design and
            cross-platform compatibility, creating web applications that
            functioned flawlessly on both desktop and mobile devices. Key
            Highlights: Refactored legacy codebases into modern React
            architecture, significantly improving maintainability and reducing
            technical debt. Successfully implemented Redux Persist to maintain
            user sessions and state across browser refreshes, enhancing user
            experience. Worked on integrating authentication flows (OAuth and
            JWT) to secure applications while providing a seamless user login
            experience. Led the effort to improve application performance by
            identifying bottlenecks, reducing load times, and optimizing API
            calls for efficiency. Proactively contributed to the team&apos;s growth
            by mentoring junior developers and sharing knowledge on React best
            practices and advanced concepts. Built and deployed production-ready
            applications with CI/CD pipelines, ensuring faster delivery cycles
            and automated testing for bug-free deployments.
          </p>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      ),
    },
    {
      title: "2018-2022",
      content: (
        <div>
          <p className="text-white uppercase dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            b.tech - ilahia college of engineering and technology
          </p>
          <p className="text-white dark:text-neutral-200 text-xs text-left  md:text-sm md:text-justify md:font-normal mb-8">
            Actively participated in various tech events, hackathons, and coding
            competitions, showcasing creativity and problem-solving skills in a
            collaborative environment. Secured certifications in cutting-edge
            technologies such as React.js, Node.js, JavaScript, and Python
            through platforms like Coursera, Udemy, and HackerRank,
            strengthening technical expertise and staying updated with industry
            trends. Successfully completed multiple freelancing projects during
            college, building dynamic and responsive websites, implementing
            e-commerce solutions, and customizing web applications for clients.
            Designed and developed custom websites for small businesses using
            React.js, Next.js, and Tailwind CSS, ensuring seamless user
            experiences and cross-platform compatibility. Built backend systems
            with Node.js and MongoDB, integrating secure authentication and
            payment systems for client applications. Maintained strong client
            communication, understanding their requirements, and delivering
            high-quality solutions within deadlines. Served as an active member
            of the college coding club, organizing workshops, mentoring junior
            students, and contributing to a collaborative learning environment.
            Represented the college in inter-college hackathons, leading teams
            to develop innovative projects under tight deadlines, including:
            Smart Attendance System: A web-based solution using React.js and
            Firebase for tracking attendance digitally. AI-Powered Chatbot:
            Built using Python and Dialogflow, providing automated support for
            university administrative tasks. Published technical blogs and
            tutorials on platforms like Medium and Dev.to, sharing knowledge on
            frontend development, state management, and API integrations.
            Consistently explored new technologies and built personal projects,
            such as a task management app and a weather dashboard, to deepen
            hands-on expertise. Key Highlights: Earned recognition for
            outstanding contributions in college tech fests, winning awards for
            innovative project ideas and software development skills. Completed
            internships during semester breaks, further honing development
            skills and gaining real-world experience. Built a strong portfolio
            showcasing personal projects and freelance work, setting a
            foundation for a successful career in software development.
            Certifications & Tools: Technologies: React.js, Node.js, JavaScript
            (ES6+), Python, MongoDB, Tailwind CSS, Next.js, Firebase.
            Certifications: Web Development Bootcamp (Udemy), JavaScript
            Essentials (Coursera), Data Structures & Algorithms (HackerRank).
            Freelancing Platforms: Fiverr, Upwork, Toptal.
          </p>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-black">
      <Timeline data={data} />
    </div>
  );
};

export default Experience;
