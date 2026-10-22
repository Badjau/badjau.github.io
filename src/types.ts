export type ModelPose = {
  rotation: [number, number, number];
  position: [number, number, number];
  scale: number;
};

export type ProjectChapter = {
  id: string;
  index: string;
  label: string;
  title: string;
  body: string;
  detail: string;
  pose: ModelPose;
};

export type ProjectPhoto = {
  source: string;
  alt: string;
};

export type PortfolioProject = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  repositoryUrl: string;
  model: {
    source: string;
    fallbackImage: string;
    photos: ProjectPhoto[];
  };
  chapters: ProjectChapter[];
};
