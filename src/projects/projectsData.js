// ============================================================
//  projectsData.js
//  images[] items:
//    src       — imported asset
//    caption   — short line for alt text + mobile caption
//    insight?  — optional { eyebrow?, headline, body } for desktop flip-back;
//                professional narrative; falls back to caption if omitted.
// ============================================================

import project1A from "../assets/project1A.png";
import project1B from "../assets/project1B.png";
import project1C from "../assets/project1C.png";
import project1D from "../assets/project1D.png";
import project1E from "../assets/project1E.png";
import project1F from "../assets/project1F.png";

import project2A from "../assets/project2A.png";
import project2B from "../assets/project2B.png";
import project2C from "../assets/project2C.png";
import project2D from "../assets/project2D.png";
import project2E from "../assets/project2E.png";
import project2F from "../assets/project2F.png";
import project2G from "../assets/project2G.png";
import project2H from "../assets/project2H.png";
import project2I from "../assets/project2I.png";


import project3A from "../assets/project3A.png";
import project3B from "../assets/project3B.png";
import project3C from "../assets/project3C.png";
import project3D from "../assets/project3D.png";
import project3E from "../assets/project3E.png";
import project3F from "../assets/project3F.png";
import project3G from "../assets/project3G.png";

import project4A from "../assets/project4A.png";
import project4B from "../assets/project4B.png";
import project4C from "../assets/project4C.png";
import project4D from "../assets/project4D.png";
import project4E from "../assets/project4E.png";
import project4F from "../assets/project4F.png";
import project4G from "../assets/project4G.png";

import project5A from "../assets/project5A.png";
import project5B from "../assets/project5B.png";
import project5C from "../assets/project5C.png";
import project5D from "../assets/project5D.png";
import project5E from "../assets/project5E.png";

const projects = [
  {
    id: 1,
    title: "6-DOF Motorized Robotic Arm",
    status: "active",
    description:
      "Developing a high-precision robotic arm featuring a 15cm reach and 150g payload capacity. Currently integrating gesture-based control and inverse kinematics using OpenCV and MediaPipe to allow for intuitive, real-time human-robot interaction.",
    github: "https://github.com/ayush-gandhi06/MRA-MARK1",
    //demo: { type: "link", url: "https://yourdemo.link" },
    images: [
      {
        src: project5A,
        caption: "Robotic Arm made by me with no motors for inspiration and fundamentals understanding",
        insight: {
          eyebrow: "Concept & kinematics",
          headline: "Mechanical study without actuation",
          body: "A non-motorized arm prototype established link geometry, joint limits, and workspace intuition before committing to drivers and control firmware.",
        },
      },
      {
        src: project5B,
        caption: "Custom Design of the base which will be use a stepper motor with Planetary Gear system",
        insight: {
          eyebrow: "Drive architecture",
          headline: "Planetary-geared base concept",
          body: "The base integrates a stepper motor with a planetary reduction stage to increase torque at the first joint while keeping the footprint compact.",
        },
      },
      {
        src: project5C,
        caption: "Custom Design of the arm, extending out to 15 cm",
        insight: {
          eyebrow: "Reach specification",
          headline: "15 cm articulated reach",
          body: "Link lengths and shoulder–elbow offsets were tuned so the end-effector meets the 15 cm reach target without exceeding motor torque budgets.",
        },
      },
      {
        src: project5D,
        caption: "Custom Design of the claw",
        insight: {
          eyebrow: "End effector",
          headline: "Gripper for 150 g payloads",
          body: "The claw geometry balances clamping force with stroke length so delicate parts can be grasped reliably within the arm’s rated payload.",
        },
      },
      {
        src: project5E,
        caption: "",
        insight: {
          eyebrow: "Next milestone",
          headline: "Integration in progress",
          body: "Documentation and imagery for the next build stage will be published as actuators, encoders, and control loops come online.",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Mars Explorer: Omnidirectional Rover",
    status: "active",
    description:
      "Developing an omnidirectional exploration rover utilizing Mecanum wheels for 360° maneuverability. Features a continuous-rotation ultrasonic scanning system for real-time obstacle avoidance and environmental mapping. Integrated a custom-built web UI for manual joystick overrides and live telemetry, with future plans for AI-driven object detection and vision-based navigation.",
    github: "https://github.com/ayush-gandhi06/Mars-Explorer-Omnidirectional-Rover",
    //demo: { type: "link", url: "https://yourdemo.link" },
    images: [
      {
        src: project4A,
        caption: "Buying the Mecanum wheels that will be used for Trail Blazer",
        insight: {
          eyebrow: "Mobility foundation",
          headline: "Mecanum wheel selection",
          body: "Omnidirectional wheels were chosen so Trail Blazer can translate and rotate independently—critical for tight mapping passes and station-keeping.",
        },
      },
      {
        src: project4B,
        caption: "Custom Chassis design using Onshape",
        insight: {
          eyebrow: "Mechanical design",
          headline: "Parametric chassis in Onshape",
          body: "The chassis was modeled parametrically to align wheel pods, sensor mounts, and battery mass for predictable dynamics during holonomic moves.",
        },
      },
      {
        src: project4C,
        caption: "Inauguration of Trail Blazer",
        insight: {
          eyebrow: "Program milestone",
          headline: "Trail Blazer roll-out",
          body: "First full mechanical bring-up validated clearances, wiring serviceability, and the visual identity of the rover before electronics hardening.",
        },
      },
      {
        src: project4D,
        caption: "Working on the general electronics layout and coding the mecanum wheels",
        insight: {
          eyebrow: "Controls & layout",
          headline: "Electrical architecture + wheel firmware",
          body: "Power distribution, motor drivers, and microcontroller I/O were laid out alongside early mecanum mixing code to prove drive direction and PWM scaling.",
        },
      },
      {
        src: project4E,
        caption: "First Prototype Created",
        insight: {
          eyebrow: "Integration",
          headline: "First integrated prototype",
          body: "Mechanical, electrical, and software subsystems were merged into a single drivable unit to expose interference issues early in the schedule.",
        },
      },
      {
        src: project4F,
        caption: "Final printed version and fully ready to roll!",
        insight: {
          eyebrow: "Release candidate",
          headline: "Print-ready mechanical revision",
          body: "Bracketry and enclosures were finalized for additive manufacturing so the rover could be reproduced consistently for field trials.",
        },
      },
      {
        src: project4G,
        caption: "Implemented battery holder to keep stuctural integrity",
        insight: {
          eyebrow: "Structural integrity",
          headline: "Battery retention system",
          body: "A dedicated battery holder isolates mass from sensitive electronics and resists shock loads so the frame maintains alignment under vibration.",
        },
      },
    ],
  },
  {
    id: 3,
    title: "Autonomous Object Sorting Robot",
    status: "completed",
    description:
      "Engineered an intelligent sorting system that achieved 90% classification accuracy through sensor-fused algorithms. I implemented custom PID control loops and shortest-path routing to ensure precise navigation within tight spatial constraints.",
    github: "https://github.com/armaan-dot/ColorSorter",
    //demo: { type: "mp4", url: "https://youtube.com/watch?v=yourvideohere" },
    images: [
      {
        src: project3A,
        caption: "Early prototype to understand the components and general idea",
        insight: {
          eyebrow: "Discovery",
          headline: "Breadboard exploration",
          body: "Initial wiring and sensing experiments de-risked component choices and clarified how classification signals would flow into motion planning.",
        },
      },
      {
        src: project3B,
        caption: "Finished and Coded first Prototype, all while realizing certain flaws and design issues",
        insight: {
          eyebrow: "Software bring-up",
          headline: "First coded prototype",
          body: "End-to-end control was implemented on the first hardware revision, surfacing mechanical backlash and sensor noise that informed the next iteration.",
        },
      },
      {
        src: project3C,
        caption: "Second Prototype which had issues wth weight distribution",
        insight: {
          eyebrow: "Design iteration",
          headline: "Weight distribution revision",
          body: "The second prototype rebalanced the drivetrain and sensor mast after traction and tipping issues appeared under aggressive cornering.",
        },
      },
      {
        src: project3D,
        caption: "Flow Chart for the team to understand the mission and priorities at hand",
        insight: {
          eyebrow: "Team alignment",
          headline: "Mission flow chart",
          body: "A shared systems diagram aligned firmware, mechanical, and testing owners on sequencing, acceptance criteria, and demo milestones.",
        },
      },
      {
        src: project3E,
        caption: "3D print of what the Robot will pick up and sort",
        insight: {
          eyebrow: "Workpiece design",
          headline: "Sortable artifact geometry",
          body: "Printed tokens exercised classifier thresholds and gripper compliance so pick-and-place tolerances could be validated before competition loads.",
        },
      },
      {
        src: project3F,
        caption: "Final Prototype with mixed designs from the first two prototypes",
        insight: {
          eyebrow: "System integration",
          headline: "Consolidated final prototype",
          body: "The shipping configuration merged the best mechanical ideas from prior revisions with tuned control gains for reliable 90% classification accuracy.",
        },
      },
      {
        src: project3G,
        caption: "Sorting system for the robot to detect",
        insight: {
          eyebrow: "Perception",
          headline: "Detection & sorting stack",
          body: "Sensor fusion and decision logic identify object classes in real time and command shortest-path moves within tight spatial constraints.",
        },
      },
    ],
  },
  {
    id: 4,
    title: "F.I.R.S.T. Robotics Lead",
    status: "completed",
    description:
      "Led a 20-member mechanical team to design and manufacture a competition robot. Optimized the mechanical assembly in SolidWorks to improve efficiency by 15% and maintained a 100% success rate for build deadlines through agile workflow planning.",
    github: "https://github.com/ayush-gandhi06/FRC",
    //demo: { type: "mp4", url: "/videos/rocket-sim-demo.mp4" },
    images: [
      {
        src: project1A,
        caption: "First Protoype with semi-working elevator system ",
        insight: {
          eyebrow: "Season kickoff",
          headline: "First elevator integration",
          body: "An early elevator concept proved travel and packaging volume while exposing belt routing issues that were resolved in the next design sprint.",
        },
      },
      {
        src: project1B,
        caption: "Remote control established connection",
        insight: {
          eyebrow: "Operator interface",
          headline: "Radio link commissioning",
          body: "Driver station pairing and failsafe checks ensured predictable command latency before autonomous routines were layered on.",
        },
      },
      {
        src: project1C,
        caption: "Visible wire connections established",
        insight: {
          eyebrow: "Serviceability",
          headline: "Traceable harness routing",
          body: "Color-coded runs and service loops improved debuggability under time pressure at regional events.",
        },
      },
      {
        src: project1D,
        caption: "Grabbing a cone, showcase of first successful reach test!",
        insight: {
          eyebrow: "Game piece",
          headline: "First successful cone acquisition",
          body: "End-effector geometry and intake timing converged to a repeatable cone grab—an external demo milestone for sponsors and judges.",
        },
      },
      {
        src: project1E,
        caption: "Stress-test payload and display of extendable arm and claw",
        insight: {
          eyebrow: "Performance demo",
          headline: "Reach + payload stress display",
          body: "The arm and claw were exercised at extension to communicate structural margin and controller stability under contest-like loading.",
        },
      },
      {
        src: project1F,
        caption: "Display of the backside of the extendable arm system",
        insight: {
          eyebrow: "Mechanical detail",
          headline: "Rear-stage packaging",
          body: "The aft view highlights cable management, hard stops, and bearing blocks that keep the extending stage rigid without binding.",
        },
      },
    ],
  },
  {
    id: 5,
    title: "Saturn-V Flight Simulator",
    status: "completed",
    description:
      "Built a physics-driven simulation in Python to model multi-stage rocket separation and fuel dynamics. By validating the model against authentic NASA telemetry data and debugging core algorithms, I achieved a 5% increase in trajectory accuracy.",
    github: "https://github.com/ayush-gandhi06/The-Variance-of-the-Saturn-V-speed-at-the-end-of-the-atmosphere/blob/main/Saturn%20V.ipynb",
    images: [
      {
        src: project2A,
        caption: "Apollo Launch Trajectory in Earth atmosphere",
        insight: {
          eyebrow: "Trajectory",
          headline: "Atmospheric ascent profile",
          body: "Integrated translational dynamics reproduce the early ascent corridor, anchoring downstream staging and guidance comparisons.",
        },
      },
      {
        src: project2B,
        caption: "Comparison to real research paper answers. It's very accurate!!",
        insight: {
          eyebrow: "Verification",
          headline: "Literature agreement",
          body: "Simulation outputs were overlaid on published reference solutions; close agreement validates discretization choices and boundary conditions.",
        },
      },
      {
        src: project2C,
        caption: "Variations in Saturn V speed in the atmosphere versus the distance in X travelled",
        insight: {
          eyebrow: "State analysis",
          headline: "Speed vs. downrange distance",
          body: "Spatially indexed velocity traces expose where drag and thrust transitions dominate, informing mesh refinement in sensitive regimes.",
        },
      },
      {
        src: project2D,
        caption: "Saturn V speed versus time elapsed!",
        insight: {
          eyebrow: "Temporal dynamics",
          headline: "Speed history vs. mission time",
          body: "Time-domain speed curves highlight staging events and throttle programs, supporting timing-sensitive abort and staging studies.",
        },
      },
      {
        src: project2E,
        caption: "Changes in Air density when ascending into the atmosphere",
        insight: {
          eyebrow: "Environment model",
          headline: "Density lapse with altitude",
          body: "Atmospheric density profiles couple into aerodynamic force tables so dynamic pressure trends align with historical flight data.",
        },
      },
      {
        src: project2F,
        caption: "Comparison to real reseach paper. It's very accurate!",
        insight: {
          eyebrow: "Cross-validation",
          headline: "Secondary reference check",
          body: "An independent dataset cross-checks the primary paper results, tightening confidence in the 5% accuracy improvement claim.",
        },
      },
      {
        src: project2G,
        caption: "List of Saturn V data collected during the simulation",
        insight: {
          eyebrow: "Telemetry",
          headline: "Simulated instrument suite",
          body: "Structured logging captures thrust, mass flow, angle of attack, and IMU-equivalent states for export to notebooks and plots.",
        },
      },
      {
        src: project2H,
        caption: "We wanted to test the different speeds available to the rocket as we change the amount of initials fuel given to it",
        insight: {
          eyebrow: "Parametric study",
          headline: "Initial fuel sensitivity",
          body: "Sweeping initial propellant mass maps achievable burnout velocities, illustrating trade-offs between payload and performance margin.",
        },
      },
      {
        src: project2I,
        caption: "Each fuel configuration resulted in different trajectories, it's so interesting!",
        insight: {
          eyebrow: "Design space",
          headline: "Trajectory family comparison",
          body: "Families of trajectories show how small fueling deltas reshape apogee targeting—useful for mission planning what-if analyses.",
        },
      },
    ],
  },
];

export default projects;
