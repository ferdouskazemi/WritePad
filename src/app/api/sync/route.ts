import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { NoteRecord, OutboxRecord } from "@/lib/db";

interface SyncRequestBody {
  outbox: OutboxRecord[];
  lastPullTime?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!session || !userId) {
      return NextResponse.json(
        { error: "Unauthorized: Sign in with Google to sync across devices" },
        { status: 401 }
      );
    }

    const body: SyncRequestBody = await req.json();
    const { outbox = [], lastPullTime } = body;

    let conflictCopiesCount = 0;
    const resolvedNotes: NoteRecord[] = [];

    // 1. Process Outbox pushes
    for (const item of outbox) {
      const incomingNote = item.payload;
      if (!incomingNote || !incomingNote.id) continue;

      const existingDbNote = await prisma.note.findUnique({
        where: { id: incomingNote.id },
      });

      if (existingDbNote && existingDbNote.userId === userId) {
        // Check for version conflict
        if (existingDbNote.version > incomingNote.version) {
          // Conflict: Keep both! Winning copy is DB, losing copy is created as conflict copy
          conflictCopiesCount++;
          const conflictId = crypto.randomUUID();
          const conflictTitle = `${incomingNote.title} (conflict copy)`;
          const conflictNote = await prisma.note.create({
            data: {
              id: conflictId,
              userId,
              title: conflictTitle,
              content: incomingNote.content,
              rating: incomingNote.rating,
              pinned: false,
              version: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          });
          resolvedNotes.push({
            id: conflictNote.id,
            title: conflictNote.title,
            content: conflictNote.content,
            rating: conflictNote.rating,
            pinned: conflictNote.pinned,
            version: conflictNote.version,
            createdAt: conflictNote.createdAt.toISOString(),
            updatedAt: conflictNote.updatedAt.toISOString(),
            deletedAt: conflictNote.deletedAt?.toISOString() || null,
          });
        } else {
          // Regular update: incoming version is newer or equal
          const updated = await prisma.note.update({
            where: { id: incomingNote.id },
            data: {
              title: incomingNote.title,
              content: incomingNote.content,
              rating: incomingNote.rating,
              pinned: incomingNote.pinned,
              version: incomingNote.version,
              updatedAt: new Date(),
              deletedAt: incomingNote.deletedAt ? new Date(incomingNote.deletedAt) : null,
            },
          });
          resolvedNotes.push({
            id: updated.id,
            title: updated.title,
            content: updated.content,
            rating: updated.rating,
            pinned: updated.pinned,
            version: updated.version,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
            deletedAt: updated.deletedAt?.toISOString() || null,
          });
        }
      } else {
        // Create new note in account
        const created = await prisma.note.create({
          data: {
            id: incomingNote.id,
            userId,
            title: incomingNote.title,
            content: incomingNote.content,
            rating: incomingNote.rating,
            pinned: incomingNote.pinned,
            version: incomingNote.version,
            createdAt: new Date(incomingNote.createdAt || Date.now()),
            updatedAt: new Date(incomingNote.updatedAt || Date.now()),
            deletedAt: incomingNote.deletedAt ? new Date(incomingNote.deletedAt) : null,
          },
        });
        resolvedNotes.push({
          id: created.id,
          title: created.title,
          content: created.content,
          rating: created.rating,
          pinned: created.pinned,
          version: created.version,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
          deletedAt: created.deletedAt?.toISOString() || null,
        });
      }
    }

    // 2. Pull server changes since last pull time
    const pullDate = lastPullTime ? new Date(lastPullTime) : new Date(0);
    const serverChanges = await prisma.note.findMany({
      where: {
        userId,
        updatedAt: { gt: pullDate },
      },
    });

    const pulledNotes: NoteRecord[] = serverChanges.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      rating: n.rating,
      pinned: n.pinned,
      version: n.version,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
      deletedAt: n.deletedAt?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      syncedCount: outbox.length,
      pulledNotes,
      conflictCopiesCount,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sync API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during note sync" },
      { status: 500 }
    );
  }
}
