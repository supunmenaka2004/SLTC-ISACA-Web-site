import { AppDatabase, TeamMember, CommitteeMember } from "./schema";

/**
 * Derives a committee category from a member's role/position.
 */
export function deriveCategoryFromRole(role: string): "Executive" | "Technical" | "Operations" {
  const r = (role || "").toLowerCase();
  if (r.includes("tech") || r.includes("web") || r.includes("dev") || r.includes("soft")) {
    return "Technical";
  }
  if (r.includes("event") || r.includes("logistic") || r.includes("operat") || r.includes("coord")) {
    return "Operations";
  }
  return "Executive";
}

/**
 * Derives initials from a full name (e.g. "Kavindu Perera" -> "KP").
 */
export function deriveInitials(name: string): string {
  if (!name) return "IS";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

/**
 * Generates an email if none is given.
 */
function deriveEmail(name: string): string {
  const clean = (name || "member")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ".");
  return `${clean}@isacaclub.org`;
}

/**
 * Synchronizes changes from a TeamMember to db.committee
 */
export function syncTeamToCommittee(
  db: AppDatabase,
  teamMember: TeamMember,
  action: "CREATE" | "UPDATE" | "DELETE"
) {
  if (!db.committee) db.committee = [];

  const normalizedName = teamMember.name.trim().toLowerCase();
  const normalizedRole = teamMember.role.trim().toLowerCase();

  // Find existing committee member by matching ID, exact name, or role
  const index = db.committee.findIndex(
    (c) =>
      c.id === `com-${teamMember.id}` ||
      c.id === teamMember.id ||
      c.name.trim().toLowerCase() === normalizedName ||
      (c.position.trim().toLowerCase() === normalizedRole && c.category === deriveCategoryFromRole(teamMember.role))
  );

  if (action === "DELETE") {
    if (index !== -1) {
      db.committee.splice(index, 1);
    }
    return;
  }

  const category = deriveCategoryFromRole(teamMember.role);
  const initials = deriveInitials(teamMember.name);

  if (index !== -1) {
    // Update existing committee record
    const existing = db.committee[index];
    existing.name = teamMember.name;
    existing.position = teamMember.role;
    existing.initials = initials;
    existing.category = category;
    existing.bio = teamMember.description || existing.bio;
    existing.image = teamMember.image || existing.image;
    existing.linkedin = teamMember.socialLinks?.linkedin || existing.linkedin || "https://linkedin.com";
    if (teamMember.socialLinks?.github) {
      existing.github = teamMember.socialLinks.github;
    }
    if (teamMember.socialLinks?.instagram) {
      existing.instagram = teamMember.socialLinks.instagram;
    }
    existing.order = teamMember.order ?? existing.order;
    existing.archived = teamMember.archived ?? false;
  } else {
    // Create matching committee record
    const newCommittee: CommitteeMember = {
      id: `com-${teamMember.id}`,
      name: teamMember.name,
      position: teamMember.role,
      initials,
      category,
      bio: teamMember.description || "",
      linkedin: teamMember.socialLinks?.linkedin || "https://linkedin.com",
      github: teamMember.socialLinks?.github || undefined,
      instagram: teamMember.socialLinks?.instagram || undefined,
      email: deriveEmail(teamMember.name),
      image: teamMember.image,
      order: teamMember.order ?? db.committee.length + 1,
      archived: teamMember.archived ?? false,
    };
    db.committee.push(newCommittee);
  }
}

/**
 * Synchronizes changes from a CommitteeMember to db.team
 */
export function syncCommitteeToTeam(
  db: AppDatabase,
  committeeMember: CommitteeMember,
  action: "CREATE" | "UPDATE" | "DELETE"
) {
  if (!db.team) db.team = [];

  const normalizedName = committeeMember.name.trim().toLowerCase();
  const normalizedPosition = committeeMember.position.trim().toLowerCase();

  // Find existing team member by ID or name or role
  const index = db.team.findIndex(
    (t) =>
      t.id === committeeMember.id ||
      `com-${t.id}` === committeeMember.id ||
      t.name.trim().toLowerCase() === normalizedName ||
      t.role.trim().toLowerCase() === normalizedPosition
  );

  if (action === "DELETE") {
    if (index !== -1) {
      db.team.splice(index, 1);
    }
    return;
  }

  const defaultImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";

  if (index !== -1) {
    // Update existing team member
    const existing = db.team[index];
    existing.name = committeeMember.name;
    existing.role = committeeMember.position;
    existing.description = committeeMember.bio || existing.description;
    existing.image = committeeMember.image || existing.image || defaultImage;
    existing.socialLinks = {
      linkedin: committeeMember.linkedin || existing.socialLinks?.linkedin,
      github: committeeMember.github || existing.socialLinks?.github,
      instagram: committeeMember.instagram || existing.socialLinks?.instagram,
    };
    existing.order = committeeMember.order ?? existing.order;
    existing.archived = committeeMember.archived ?? false;
  } else {
    // Create new team member
    const newTeamMember: TeamMember = {
      id: committeeMember.id.startsWith("com-") ? committeeMember.id.replace(/^com-/, "") : `team-${Date.now()}`,
      name: committeeMember.name,
      role: committeeMember.position,
      image: committeeMember.image || defaultImage,
      description: committeeMember.bio || "",
      socialLinks: {
        linkedin: committeeMember.linkedin || "https://linkedin.com",
        github: committeeMember.github || undefined,
        instagram: committeeMember.instagram || undefined,
      },
      order: committeeMember.order ?? db.team.length + 1,
      archived: committeeMember.archived ?? false,
      visible: true,
    };
    db.team.push(newTeamMember);
  }
}

/**
 * Reconciles both arrays so they share matching synchronized members.
 */
export function reconcileTeamAndCommittee(db: AppDatabase) {
  if (!db.team) db.team = [];
  if (!db.committee) db.committee = [];

  // For each team member, ensure committee has a synced matching entry
  for (const t of db.team) {
    syncTeamToCommittee(db, t, "UPDATE");
  }

  // Ensure committee members with category "Executive" exist in team
  for (const c of db.committee) {
    if (c.category === "Executive") {
      syncCommitteeToTeam(db, c, "UPDATE");
    }
  }
}
