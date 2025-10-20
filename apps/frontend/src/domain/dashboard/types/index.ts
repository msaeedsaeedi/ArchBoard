export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

export interface Board {
  boardId: string;
  slug: string;
  title: string;
  description?: string;
  collaborators?: Collaborator[];
}
