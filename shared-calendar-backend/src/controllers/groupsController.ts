import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  const { name, createdBy, memberIds = [] } = req.body;

  if (!name || !createdBy) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const group = await prisma.group.create({
      data: {
        name,
        createdBy,
        members: {
          create: Array.from(new Set([...memberIds, createdBy])).map((userId: string) => ({
            user: { connect: { id: userId } },
            role: userId === createdBy ? "admin" : "member",
          })),
        },
      },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    res.status(201).json(group);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserGroups = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
  
    try {
      const memberships = await prisma.groupMembership.findMany({
        where: { userId },
        include: {
          group: {
            include: {
              members: {
                include: { user: true },
              },
            },
          },
        },
      });
  
      const groups = memberships.map((m) => m.group);
      res.json(groups);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    const userId = req.query.userId as string; // Pass userId via query param
  
    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }
  
    try {
      // Check if user is the creator (admin)
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });
  
      if (!group || group.createdBy !== userId) {
        res.status(403).json({ error: "Only the creator can delete this group." });
        return;
      }
  
      await prisma.group.delete({
        where: { id: groupId },
      });
  
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  