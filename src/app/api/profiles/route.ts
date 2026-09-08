import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const HERMES_HOME = "/home/ubuntu/.hermes";

export async function GET() {
  try {
    const profiles = await readdir(join(HERMES_HOME, "profiles"));
    const profilesWithSkills = await Promise.all(
      profiles.map(async (name) => {
        const skillsPath = join(HERMES_HOME, "profiles", name, "skills");
        let skills: string[] = [];
        try {
          skills = await readdir(skillsPath);
        } catch {
          // no skills dir
        }
        return { name, skills };
      })
    );
    return NextResponse.json({ profiles: profilesWithSkills });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
