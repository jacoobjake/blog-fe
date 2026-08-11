"use client";

import type { AuthorProfile } from "@/lib/types";
import { Link } from "@heroui/react";

type AuthorListProps = {
  authors: AuthorProfile[];
};

export default function AuthorList({ authors }: AuthorListProps) {
  if (authors.length === 0) {
    return <p className="text-muted">No author profiles yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Linked user</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id} className="border-b border-border/60">
              <td className="py-3 pr-4">{author.name}</td>
              <td className="py-3 pr-4">
                {author.user ? (
                  <div>
                    <p>{author.user.name}</p>
                    <p className="text-sm text-muted">{author.user.email}</p>
                  </div>
                ) : (
                  <span className="text-muted">Not linked</span>
                )}
              </td>
              <td className="py-3">
                <Link href={`/admin/authors/${author.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
