import type { Organization } from "@/lib/types";

export const organizations: Organization[] = [
  {
    slug: "pratham-books",
    name: "Pratham Books",
    shortName: "Pratham",
    tagline: "A book in every child's hand.",
    description:
      "Pratham Books is a non-profit children's publisher whose StoryWeaver platform hosts thousands of openly licensed picture books in more than a hundred languages. Every story here is free to read, print, translate and share, and most come with a Kannada edition.",
    focus: ["Picture books", "Folk tales", "Kannada & English", "CC BY licensed"],
    website: "https://storyweaver.org.in",
    color: "#f2b33d",
    color2: "#e8762b",
    ink: "dark",
    motif: "kites",
    languages: ["English", "Kannada", "Hindi"],
    imagePrompt:
      "Warm flat illustration of village children reading picture books under a banyan tree, a goat and a crow peeking at the pages, paper kites in a sunny sky, Indian storybook style, soft textures, golden yellow and orange palette",
  },
  {
    slug: "iia",
    name: "Indian Institute of Astrophysics",
    shortName: "IIA",
    tagline: "Dark skies, bright minds.",
    description:
      "The Indian Institute of Astrophysics brings astronomy to rural Karnataka, where the night skies are among the darkest in the state. Their e-library of Kannada and English resources covers the Sun, the planets, meteor showers and the Zero Shadow Day experiments run in Arivu Kendras every year.",
    focus: ["Astronomy", "Night sky guides", "Zero Shadow Day", "Science activities"],
    website: "https://www.iiap.res.in",
    color: "#1e2a5a",
    color2: "#3b2e7a",
    ink: "light",
    motif: "stars",
    languages: ["English", "Kannada"],
    noApprovalRequired: true,
    imagePrompt:
      "Flat illustration of two children and a librarian looking through a telescope on a village rooftop at night, the Milky Way arching over coconut palms, a meteor streaking, deep indigo and violet palette with warm lantern light",
  },
  {
    slug: "sikshana",
    name: "Sikshana Foundation",
    shortName: "Sikshana",
    tagline: "Self-paced learning for every classroom.",
    description:
      "Sikshana Foundation runs Sikshanapedia, a learning platform used in more than 2,700 Gram Panchayat libraries. Their collection covers Classes 8 to 12, digital literacy and training modules for self-help groups, with built-in quizzes so learners can check their own progress.",
    focus: ["Classes 8–12", "Science & Maths", "Digital literacy", "Quizzes"],
    website: "https://sikshana.org",
    color: "#1f6f78",
    color2: "#2d8f8a",
    ink: "light",
    motif: "pencil",
    languages: ["English", "Kannada"],
    imagePrompt:
      "Flat illustration of a bright village computer lab with students at desktops, a chalkboard with geometry diagrams and a lens ray diagram, a teacher pointing, teal and sea-green palette with warm wood accents",
  },
  {
    slug: "adhyayan",
    name: "Adhyayan Foundation",
    shortName: "Adhyayan",
    tagline: "Read aloud. Read together.",
    description:
      "Adhyayan Foundation's Read-Aloud Programme trains Gram Panchayat librarians to turn libraries into places children want to visit. Their guides and story collections are written for the adult reading out loud, with prompts, pauses and questions built into the text.",
    focus: ["Read-aloud programme", "Librarian training", "Story collections"],
    website: "https://adhyayanfoundation.org",
    color: "#d9674a",
    color2: "#e8905f",
    ink: "light",
    motif: "lantern",
    languages: ["English", "Kannada"],
    imagePrompt:
      "Flat illustration of a librarian reading aloud from a big picture book to a circle of children on colourful floor cushions, a lantern glowing, bookshelves and indoor plants behind, terracotta, peach and cream palette",
  },
  {
    slug: "akanksha",
    name: "Akanksha Charitable Trust",
    shortName: "Akanksha",
    tagline: "Coaching for the coast's classrooms.",
    description:
      "Akanksha Charitable Trust works with high-school students in Dakshina Kannada, Uttara Kannada and Mangaluru, with college volunteers teaching Maths, English and Kannada inside Gram Panchayat libraries. Their books double as the coursework for a 32-week coaching calendar and NMMS scholarship preparation.",
    focus: ["Classes 8–10", "NMMS preparation", "English & Maths", "Skill building"],
    color: "#3c6b4a",
    color2: "#5a8f5f",
    ink: "light",
    motif: "leaves",
    languages: ["English", "Kannada"],
    imagePrompt:
      "Flat illustration of college volunteers teaching a small group of teenagers in a coastal Karnataka library, fishing boats and coconut trees visible through the window, a whiteboard with fractions, forest green and moss palette with sand accents",
  },
  {
    slug: "cmca",
    name: "Children's Movement for Civic Awareness",
    shortName: "CMCA",
    tagline: "Little citizens, big values.",
    description:
      "CMCA helps children live the values of the Constitution: equality, diversity and gender inclusion. Their activity cards, games and reflection questions are designed for Classes 6 to 8 and are led by librarians following a weekly timetable.",
    focus: ["Citizenship", "Constitution values", "Gender equality", "Activity cards"],
    website: "https://cmcaindia.org",
    color: "#2f4d8a",
    color2: "#4a6fb5",
    ink: "light",
    motif: "bridge",
    languages: ["English", "Kannada"],
    imagePrompt:
      "Flat illustration of diverse Indian children holding up colourful activity cards and a hand-painted banner reading EQUALITY, a girl driving a toy bus, a boy watering plants, royal blue and gold palette, hopeful and playful",
  },
  {
    slug: "nios",
    name: "National Institute of Open Schooling",
    shortName: "NIOS",
    tagline: "School, on your own terms.",
    description:
      "NIOS is the national board for open and distance schooling. Through accredited institutes across Karnataka, learners can complete Secondary and Senior Secondary courses and vocational programmes at their own pace. This collection holds the official course books and enrolment guides.",
    focus: ["Secondary courses", "Senior Secondary", "Vocational", "Enrolment guides"],
    website: "https://nios.ac.in",
    color: "#7a2e3b",
    color2: "#a1434f",
    ink: "light",
    motif: "books",
    languages: ["English", "Hindi", "Kannada"],
    noApprovalRequired: true,
    imagePrompt:
      "Flat illustration of a young woman studying by lamplight at a farmhouse table with open course books and a certificate on the wall, a window showing fields at dusk, maroon, rose and cream palette, dignified and calm",
  },
  {
    slug: "ilp",
    name: "India Literacy Project",
    shortName: "ILP",
    tagline: "Careers, courses, colleges.",
    description:
      "India Literacy Project works in more than 2,000 villages across eight states. Their Multi-Dimensional Learning Spaces bring science kits and internet-based learning into government schools, and their career guidance series helps rural students choose courses, colleges and scholarships.",
    focus: ["Career guidance", "Science kits", "Scholarships", "Learning spaces"],
    website: "https://ilpnet.org",
    color: "#b86e12",
    color2: "#d9962c",
    ink: "light",
    motif: "map",
    languages: ["English", "Kannada"],
    imagePrompt:
      "Flat illustration of a rural student standing at a crossroads signpost pointing to Engineering, Nursing, Agriculture and Design, holding a science kit box, a map of Karnataka in the sky, amber, ochre and mustard palette",
  },
];
