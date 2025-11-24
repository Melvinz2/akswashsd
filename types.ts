
export interface Student {
  id: string;
  username: string;
  name: string;
  role: 'student' | 'admin';
  // accessKey removed for security. Password should never exist in the frontend object.
}

export interface AuthResponse {
  user: Student;
  token: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  zipFileName: string;
  fileStructure: string; // For AI context
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
