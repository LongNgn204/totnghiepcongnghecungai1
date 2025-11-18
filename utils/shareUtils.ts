// Utility functions for sharing study resources

export interface SharedResource {
  id: string;
  type: 'exam' | 'flashcard-deck' | 'chat';
  title: string;
  content: any;
  createdBy: string;
  createdAt: number;
  isPublic: boolean;
  views: number;
  likes: number;
  category?: string;
  grade?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  createdBy: string;
  createdAt: number;
  category: string;
  isPublic: boolean;
  resources: string[]; // Resource IDs
  chat: GroupMessage[];
}

export interface GroupMember {
  id: string;
  name: string;
  role: 'admin' | 'member';
  joinedAt: number;
  points: number;
}

export interface GroupMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  attachments?: string[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  examsCompleted: number;
  flashcardsLearned: number;
  studyTime: number;
  rank: number;
  badge?: string;
}

const STORAGE_KEYS = {
  SHARED_RESOURCES: 'shared_resources',
  STUDY_GROUPS: 'study_groups',
  USER_PROFILE: 'user_profile',
  LEADERBOARD: 'leaderboard',
};

// User Profile
export const getUserProfile = (): GroupMember => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (stored) {
    return JSON.parse(stored);
  }
  // Create default profile
  const profile: GroupMember = {
    id: `user_${Date.now()}`,
    name: 'Học sinh',
    role: 'member',
    joinedAt: Date.now(),
    points: 0,
  };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  return profile;
};

export const updateUserProfile = (updates: Partial<GroupMember>): void => {
  const profile = getUserProfile();
  const updated = { ...profile, ...updates };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
};

// Shared Resources
export const getSharedResources = (): SharedResource[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SHARED_RESOURCES);
  return stored ? JSON.parse(stored) : [];
};

export const saveSharedResource = (resource: Omit<SharedResource, 'id' | 'createdAt' | 'views' | 'likes'>): string => {
  const resources = getSharedResources();
  const newResource: SharedResource = {
    ...resource,
    id: `share_${Date.now()}`,
    createdAt: Date.now(),
    views: 0,
    likes: 0,
  };
  resources.push(newResource);
  localStorage.setItem(STORAGE_KEYS.SHARED_RESOURCES, JSON.stringify(resources));
  return newResource.id;
};

export const getSharedResource = (id: string): SharedResource | null => {
  const resources = getSharedResources();
  const resource = resources.find(r => r.id === id);
  if (resource) {
    // Increment views
    resource.views++;
    localStorage.setItem(STORAGE_KEYS.SHARED_RESOURCES, JSON.stringify(resources));
  }
  return resource || null;
};

export const likeResource = (id: string): void => {
  const resources = getSharedResources();
  const resource = resources.find(r => r.id === id);
  if (resource) {
    resource.likes++;
    localStorage.setItem(STORAGE_KEYS.SHARED_RESOURCES, JSON.stringify(resources));
  }
};

export const deleteSharedResource = (id: string): void => {
  const resources = getSharedResources();
  const filtered = resources.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.SHARED_RESOURCES, JSON.stringify(filtered));
};

// Study Groups
export const getStudyGroups = (): StudyGroup[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS);
  return stored ? JSON.parse(stored) : [];
};

export const createStudyGroup = (group: Omit<StudyGroup, 'id' | 'createdAt' | 'members' | 'resources' | 'chat'>): string => {
  const groups = getStudyGroups();
  const user = getUserProfile();
  
  const newGroup: StudyGroup = {
    ...group,
    id: `group_${Date.now()}`,
    createdAt: Date.now(),
    members: [{ ...user, role: 'admin' }],
    resources: [],
    chat: [],
  };
  
  groups.push(newGroup);
  localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
  return newGroup.id;
};

export const getStudyGroup = (id: string): StudyGroup | null => {
  const groups = getStudyGroups();
  return groups.find(g => g.id === id) || null;
};

export const joinStudyGroup = (groupId: string): boolean => {
  const groups = getStudyGroups();
  const group = groups.find(g => g.id === groupId);
  const user = getUserProfile();
  
  if (!group || group.members.some(m => m.id === user.id)) {
    return false;
  }
  
  group.members.push({ ...user, role: 'member' });
  localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
  return true;
};

export const leaveStudyGroup = (groupId: string): void => {
  const groups = getStudyGroups();
  const group = groups.find(g => g.id === groupId);
  const user = getUserProfile();
  
  if (group) {
    group.members = group.members.filter(m => m.id !== user.id);
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
  }
};

export const addGroupMessage = (groupId: string, message: string): void => {
  const groups = getStudyGroups();
  const group = groups.find(g => g.id === groupId);
  const user = getUserProfile();
  
  if (group) {
    const newMessage: GroupMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      message,
      timestamp: Date.now(),
    };
    group.chat.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
  }
};

export const addResourceToGroup = (groupId: string, resourceId: string): void => {
  const groups = getStudyGroups();
  const group = groups.find(g => g.id === groupId);
  
  if (group && !group.resources.includes(resourceId)) {
    group.resources.push(resourceId);
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(groups));
  }
};

// Leaderboard
export const getLeaderboard = (): LeaderboardEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
  const leaderboard: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
  
  // Sort by points and add ranks
  leaderboard.sort((a, b) => b.points - a.points);
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
    // Assign badges
    if (entry.rank === 1) entry.badge = '🥇';
    else if (entry.rank === 2) entry.badge = '🥈';
    else if (entry.rank === 3) entry.badge = '🥉';
    else if (entry.points >= 1000) entry.badge = '⭐';
    else if (entry.points >= 500) entry.badge = '🌟';
  });
  
  return leaderboard;
};

export const updateLeaderboard = (points: number, exams?: number, flashcards?: number, studyTime?: number): void => {
  const leaderboard = getLeaderboard();
  const user = getUserProfile();
  
  const existingEntry = leaderboard.find(e => e.userId === user.id);
  
  if (existingEntry) {
    existingEntry.points += points;
    if (exams) existingEntry.examsCompleted += exams;
    if (flashcards) existingEntry.flashcardsLearned += flashcards;
    if (studyTime) existingEntry.studyTime += studyTime;
  } else {
    leaderboard.push({
      userId: user.id,
      userName: user.name,
      points,
      examsCompleted: exams || 0,
      flashcardsLearned: flashcards || 0,
      studyTime: studyTime || 0,
      rank: 0,
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  
  // Update user points
  updateUserProfile({ points: user.points + points });
};

// Share URL generation
export const generateShareUrl = (resourceId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/chia-se/${resourceId}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};
