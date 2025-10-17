export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

export interface Board {
  id: number;
  slug: string;
  title: string;
  description?: string;
  sharedBoard: boolean;
  collaborators?: Collaborator[];
}
