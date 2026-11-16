// Portfolio V5 — project summaries grounded in the owner's repository documentation.
// Keep this file data-only so the project categories, links and cards remain easy to edit.
export const roboticsProjects = [
  {
    slug: "trackslam",
    title: "TrackSLAM",
    category: "Autonomous Robotics · SLAM",
    desc: "A ROS 2 mobile robot that maps its environment with LiDAR SLAM, tracks a moving target with computer vision, and follows it using PID control and obstacle avoidance.",
    techStack: "ROS 2 · Gazebo · OpenCV · C++ · LiDAR",
    image: "/assets/projects/trackslam-thumbnail.png",
    poster: "/assets/projects/trackslam-thumbnail.png",
    video: "/assets/videos/trackslam-demo.mp4",
    link: "https://github.com/shafeeqsadiq/TrackSLAM",
    details: [
      "Simulated differential-drive mobile robot in Gazebo with LiDAR, RGB camera and odometry",
      "2D graph-based mapping with slam_toolbox and ROS 2 localization transforms",
      "OpenCV color-segmentation pipeline for visual target detection and tracking",
      "C++ angular and linear PID loops for target-centering and distance regulation",
      "LiDAR-aware slowdowns, emergency turns and reverse escape behaviors",
    ],
  },
  {
    slug: "swarm",
    title: "Multi-Agent Swarm Simulator",
    category: "Swarm Robotics · Multi-Agent Systems",
    desc: "A decentralized robot-swarm simulator where agents form teams, elect leaders, allocate tasks and recover from failures using local communication.",
    techStack: "Python · Mesa · NetworkX · Matplotlib",
    image: "/assets/projects/swarm-thumbnail.png",
    poster: "/assets/projects/swarm-thumbnail.png",
    video: "/assets/videos/swarm-simulator-demo.mp4",
    link: "https://github.com/shafeeqsadiq/Swarm-Simulator",
    details: [
      "Dynamic team formation from proximity-based local communication",
      "Bully-algorithm leader election and re-election after agent failures",
      "Decentralized task discovery, assignment and load distribution",
      "Failure recovery, task redistribution and robot re-entry into the swarm",
      "Real-time spatial/network visualizations and evaluation scenarios",
    ],
  },
];

export const softwareProjects = [
  {
    title: "Patient Monitoring Dashboard",
    category: "Health Tech · Full-Stack Development",
    desc: "A real-time dashboard that visualizes simulated patient vital signs, trends and abnormal-reading alerts across multiple patients.",
    link: "https://github.com/shafeeqsadiq/Patient-Monitoring-Dashboard",
    techStack: "React · Node.js · WebSockets · SQLite · Chart.js",
  },
  {
    title: "AllergenScan AI",
    category: "Mobile Development · Applied AI",
    desc: "A cross-platform mobile app that analyzes food photos using AI recognition and identifies potential allergens for users to review.",
    link: "https://github.com/shafeeqsadiq/AllergenScan",
    techStack: "React Native · Expo · TypeScript · Clarifai · Node.js",
  },
  {
    title: "DataWatch",
    category: "Data Engineering · ML Observability",
    desc: "An Airflow batch-pipeline monitor that detects volume, distribution and schema anomalies and triggers alerts or batch quarantine.",
    link: "https://github.com/shafeeqsadiq/DataWatch",
    techStack: "Airflow · Prophet · dbt · PostgreSQL · Grafana",
  },
  {
    title: "StreamFuse",
    category: "Real-Time Data Engineering",
    desc: "A streaming analytics platform that joins e-commerce clicks, transactions and server metrics for live operational insights.",
    link: "https://github.com/shafeeqsadiq/StreamFuse",
    techStack: "Kafka · Apache Flink · Apache Pinot · Grafana",
  },
  {
    title: "Microplastic Detection",
    category: "Computer Vision · Deep Learning",
    desc: "A YOLOv5 vision model trained to locate microplastic particles in images, with a Flask interface for image-based detection.",
    link: "https://github.com/shafeeqsadiq/Microplastic-Detection",
    techStack: "Python · YOLOv5 · PyTorch · OpenCV · Flask",
  },
];
