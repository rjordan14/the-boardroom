import { getAdminMeta, listAdminRoster, type AdminProjectMeta } from "@/lib/mock/adminRoster";

export async function getAdminProjectMeta(key: string): Promise<AdminProjectMeta | undefined> {
  return getAdminMeta(key);
}

export async function listAdminProjectMeta(): Promise<AdminProjectMeta[]> {
  return listAdminRoster();
}
