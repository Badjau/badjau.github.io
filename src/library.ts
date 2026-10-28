export type Project = {
  id: string; title: string; category: 'Hardware' | 'Software'; description: string;
  caption: string; image: string; alt: string; focus: string; repository?: string;
  cardDescription?: string;
  private?: boolean; secondaryImage?: string; secondaryAlt?: string;
  model?: string;
  animation?: { source: string; alt: string; caption: string };
  metrics?: { value: string; label: string }[];
  benchmark?: { rows: { label: string; value: string }[]; note: string };
  sections: { title: string; body: string }[];
};
// Curated public copy only. Do not add confidential implementation details.
export const projects: Project[] = [
  {
    id: 'attendance-hr-core', title: 'Attendance & HR Core', category: 'Software', private: true,
    description: 'Autonomous facial recognition for faster time-ins. A shared employee foundation for attendance, field itineraries, equipment, and documents.',
    caption: 'Connected workplace ecosystem',
    image: '/images/projects/hr-ecosystem.svg', alt: 'Attendance and HR core connecting inventory tracking and document management',
    focus: 'Autonomous facial recognition & a connected workplace ecosystem',
    metrics: [{ value: '1–3s', label: 'Reported time per time-in' }, { value: '3', label: 'Connected applications · documents in progress' }],
    sections: [
      { title: 'A faster start to the workday.', body: 'Hand logging and the previous fingerprint scanner made clocking in a repeated point of friction. Reported time-ins fell from a typical 5–10 seconds, with some employees taking up to a minute, to 1–3 seconds. The calculator below explores how those seconds accumulate across a team.' },
      { title: 'The foundation for my workplace ecosystem.', body: 'I built the attendance system into an employee and account foundation that other applications can use. Inventory connects equipment to the people using it. The document management system, still in progress, builds participant and access workflows around the same employee directory. These applications share a people foundation while managing their own work records.' },
    ],
  },
  {
    id: 'mk1', title: 'TBK-Micro Mk1', category: 'Hardware',
    description: 'My first custom keyboard. A crash course in 3D design, soldering, and making everything fit.',
    caption: 'Custom keyboard · ZMK firmware',
    image: '/images/keyboard-fallback.webp', alt: 'Finished TBK-Micro Mk1 split keyboard with sculpted cases and black keycaps',
    focus: '3D design, fabrication & firmware', repository: 'https://github.com/Badjau/zmk-config-mk1',
    model: '/models/tbk-left.drc',
    secondaryImage: '/images/projects/mk1-internals.jpg', secondaryAlt: 'Inside the hand-built TBK-Micro Mk1 keyboard',
    sections: [
      { title: 'Why split a keyboard in half?', body: 'A conventional keyboard fixes the distance and angle between your hands. A split keyboard lets you place each half independently: farther apart, turned to match your forearms, or with room for something else between them. The point is simple: give the keyboard more ways to fit your desk and the way you sit.' },
      { title: 'Fewer keys. More within reach.', body: 'A smaller keyboard does not have to give up the functions of a larger one. Layers let the same keys handle different jobs, much like holding Shift changes what a key types. That brings more controls into a compact area instead of scattering them across a wide board. The sculpted key wells and dedicated thumb keys offer a different way to arrange the controls around your fingers. Learning the layout is part of the trade-off.' },
      { title: 'Making the shape my own.', body: 'My first custom keyboard began with the TBK Mini by Bastard Keyboards. I redesigned its open shell into a compact, enclosed case and added space for an integrated display. That meant working within a real physical constraint: the switches, wiring, battery, controller, and screen all had to fit inside something I could actually print and assemble.' },
      { title: 'The curves have a job to do.', body: 'The sculpted form follows the arrangement of the keys: the main keys sit in curved wells, while the thumb keys branch out at a different angle. That creates a flowing outline instead of a flat rectangle. An organic shell lets the enclosure follow those changes in height and direction, bringing the separate key areas into one continuous object. The shape communicates how the keyboard is used, as well as giving it its character.' },
      { title: 'A smooth surface is only half the problem.', body: 'Enclosing the original design meant managing the space inside as carefully as the silhouette outside. Curved transitions had to meet switch openings, the display area, and the bottom cover without losing room for the electronics. A surface can look right on screen and still be awkward to print or assemble. CAD helped me establish the simpler shapes and dimensions; Blender let me refine the mesh and the transitions between them. The challenge was making those flowing surfaces work as a real enclosure.' },
      { title: 'A build that crossed disciplines.', body: 'I learned CAD and Blender to reshape the case, then brought it together with PLA prints, hand-soldered wiring, brass inserts, and a custom acrylic display cover. A MagSafe-compatible bottom cover adds a mounting option. This project connected digital design, fabrication, electronics, and software in one everyday object: each decision had to work with the others.' },
      { title: 'Knowing what the keyboard is doing.', body: 'When keys change roles across layers, a little feedback helps. The built-in displays show the active layer, battery level, Bluetooth profile, and typing speed, so those settings are visible on the keyboard itself. ZMK, the software running the keyboard, handles the wireless halves. A custom typing animation adds a personal touch to a tool built around practical choices.' },
    ],
  },
  {
    id: 'raven', title: 'Raven', category: 'Hardware',
    description: 'A slim wireless split keyboard with a flexible layout and custom displays, designed for everyday use and an ergonomic typing experience.',
    caption: 'Split keyboard · Custom displays',
    image: '/images/projects/raven.jpg', alt: 'Raven split keyboard with low-profile black keycaps on a blue cutting mat',
    focus: 'Keyboard configuration & display experience', repository: 'https://github.com/Badjau/zmk-config-raven',
    animation: { source: '/images/projects/raven-oled.gif', alt: 'Raven OLED showing the animated raven reacting to typing', caption: 'The OLED animation responds to typing and returns to idle when typing stops.' },
    secondaryImage: '/images/projects/raven-back.webp', secondaryAlt: 'A closer look at the Raven keyboard build',
    sections: [
      { title: 'Your hands do not have to stay together.', body: 'Most keyboards make both hands share one fixed rectangle. Raven separates that rectangle into two independently positioned halves, letting you choose the spacing and angle that suit your setup. A wireless connection between the halves keeps that freedom from being limited by a connecting cable. The compact, slim build takes the same idea into a less bulky form.' },
      { title: 'A small layout with a full set of jobs.', body: 'The everyday challenge with a compact keyboard is keeping useful controls accessible. My ZMK configuration gives Raven separate layers for numbers, navigation, function keys, media, and Bluetooth controls. Think of a layer as another set of labels on the same physical keys: a compact layout can still do many jobs, with less need to reach across a large board. It takes practice to learn where those jobs live.' },
      { title: 'Feedback that makes the layout easier to follow.', body: 'If a key can do several things, it helps to know which mode you are in. My custom displays show layer information and modifier state, including keys such as Shift and Caps Lock. A host-side helper supplies the clock on the right half. These details make the keyboard easier to read at a glance, while a tiny raven animation reacts to typing and settles back to idle when you stop.' },
      { title: 'Room for different preferences.', body: 'Raven uses a reversible circuit board with sockets for MX, Choc V1, and Choc V2 switches. That gives the build options for different switch styles without soldering each switch in place. A detachable sixth column offers another layout choice. These are useful hardware foundations for experimenting with what a keyboard should feel like; my contribution focuses on its configuration and display experience.' },
      { title: 'Making the details work together.', body: 'Powered by Supermini nRF52840 controllers, the two halves run ZMK with idle sleep and soft-off wakeup configured for everyday use. The value of this project is in bringing the controls, wireless behavior, and visual feedback together. It turns a collection of keyboard features into a setup whose behavior can be understood and adjusted by its user.' },
    ],
  },
  {
    id: 'document-parsing', title: 'Document Parsing Automation', category: 'Software', private: true,
    cardDescription: 'They spent hours checking images by hand. I built a tool that parses each one in ~15 seconds.',
    description: 'Replacing repetitive image checking and data entry with AI-assisted parsing in around 15 seconds per image.',
    caption: 'Workflow automation · In active use',
    image: '/images/projects/private-project.svg', alt: 'Abstract document and connected shapes representing language processing',
    focus: 'Image-to-data extraction & website automation',
    metrics: [{ value: '~10s', label: 'Reported parsing time per image' }, { value: '500', label: 'Users served' }, { value: '~100', label: 'Requests in peak submission bursts' }],
    benchmark: {
      rows: [
        { label: 'Mean extraction API time', value: '8.41 seconds' },
        { label: 'Correct row transcriptions', value: '106 / 108 (98.1%)' },
        { label: 'Incorrect rows left unflagged', value: '0 in this sample' },
      ],
      note: 'Saved benchmark, 21 October 2026: three runs on the same verified 36-row image, not 108 distinct examples. Extraction timing excludes upload, queueing, website updates, and human review. Earlier repetitions found unflagged errors; these results do not establish a general accuracy rate or a turnaround guarantee.',
    },
    sections: [
      { title: 'Hours of manual work, reclaimed.', body: 'The previous workflow meant encoders spending hours checking submitted images and manually entering their contents into a website. This automation takes on that repetitive first pass, turning an individual image into structured data in around 15 seconds in reported use. Staff can focus on exceptions instead of transcribing every submission.' },
      { title: 'From an image to usable information.', body: 'AI-assisted extraction reads submitted images, while a text parser handles typed input. Local validation checks the resulting fields before eligible entries reach the website. Unclear or invalid readings are held for review, giving staff a way to inspect and correct them.' },
      { title: 'Efficiency beyond the first response.', body: 'A separate, earlier three-run comparison reduced mean extraction time from 33.84 to 15.73 seconds, a 53.5% improvement, while reducing mean total token usage by 61.1%. Completed extractions are retained so later save or delivery retries can reuse them. These are focused engineering measurements, rather than a claim about billing savings or all production traffic.' },
      { title: 'Built for concentrated demand.', body: 'Reported usage spans 500 users, with bursts of roughly 100 concurrent submissions. Queued processing helps absorb busy periods, while duplicate handling and saved progress protect against repeated work. A submission burst is different from simultaneous image extraction: waiting time can grow under load.' },
    ],
  },
  {
    id: 'inventory-system', title: 'Inventory Tracking System', category: 'Software',
    description: 'Track company equipment, who has it, and every handover along the way.',
    caption: 'Equipment tracking · PHP & MySQL',
    image: '/images/projects/inventory-system.svg', alt: 'Illustrated inventory workspace with equipment, assignment status, and handover history',
    focus: 'Equipment management & traceable handovers', repository: 'https://github.com/Badjau/inventory-system',
    sections: [
      { title: 'Know where equipment goes.', body: 'An equipment list is only useful when it stays connected to the people using it. This application brings devices, assignments, photos, and handover history into one workspace. Search covers device details as well as current and previous holders.' },
      { title: 'A return keeps the story intact.', body: 'Equipment can be assigned to employees, inventory-only associates, or shared departments, then returned to the available pool. Returning a device preserves its identity and history, so the next handover builds on the previous record.' },
      { title: 'Work with the records teams already have.', body: 'Excel import previews let staff review equipment updates and holder selections before approval. Exports support reporting and later reimport. The app reads an existing HR directory while keeping inventory records and history separate.' },
      { title: 'More than an assignment list.', body: 'Device specifications, evidence photos, notes, and recorded changes provide context beyond a current status. Disposal can also recover reusable components as separate equipment records. PHP, PDO MySQL, and vanilla JavaScript keep the application straightforward to run.' },
    ],
  },
];
