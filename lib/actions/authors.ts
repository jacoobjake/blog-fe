"use server";

import { getServerApi } from "@/lib/apis/server";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
  UpdateOwnAuthorProfileDto,
} from "@/lib/schemas/author-profile";

export async function createAuthorAction(data: CreateAuthorProfileDto) {
  const api = await getServerApi();
  return api.authors.createAuthor(data);
}

export async function updateAuthorAction(
  id: string,
  data: UpdateAuthorProfileDto,
) {
  const api = await getServerApi();
  return api.authors.updateAuthor(id, data);
}

export async function updateOwnAuthorProfileAction(
  data: UpdateOwnAuthorProfileDto,
) {
  const api = await getServerApi();
  return api.authors.updateMyAuthorProfile(data);
}

export async function deleteAuthorAction(id: string) {
  const api = await getServerApi();
  await api.authors.deleteAuthor(id);
}
