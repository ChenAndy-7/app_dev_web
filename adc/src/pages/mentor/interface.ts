export interface Mentor {
    id: number;
    name: string;
    picture: string;
  }
  
  export interface Group {
    id: number;
    mentors: Mentor[];
    students: string[];
    groupNumber: number;
  }