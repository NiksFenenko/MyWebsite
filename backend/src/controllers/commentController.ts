import type { Request, Response } from "express";
import * as querie from "../db/queries";
import { getAuth } from "@clerk/express";


// Create a comment for a product
export const createComment = async (req: Request, res: Response) => {
    try { 
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

   const productId = req.params.productId as string;
  const { content } = req.body;
  
  if (!content) return res.status(400).json({ error: "Content is required" });
  

  //verify product exists
  const exists = await querie.productExists(productId);
if (!exists) return res.status(404).json({ error: "Product not found" });
   
      const comment = await querie.createComment({
      content, 
      userId, 
      productId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment (only by owner)
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const commentId = req.params.commentId as string;

    const comment = await querie.getCommentsById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId !== userId) return res.status(403).json({ error: "Forbidden" });

    await querie.deleteComment(commentId);
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};