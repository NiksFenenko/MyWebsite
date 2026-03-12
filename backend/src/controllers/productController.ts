import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

const isValidUUID = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const safeUser = (user: { id: string; name: string | null; imageUrl: string | null } | null) =>
    user ? { id: user.id, name: user.name, imageUrl: user.imageUrl } : null;


// Get all products (public)
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await queries.getAllProducts();
        res.status(200).json(products.map(p => ({ ...p, user: safeUser(p.user) })));
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({ error: "Failed to get products" });
    }
};

// Get products by current user (protected)
export const getMyProducts = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        
        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products.map(p => ({ ...p, user: safeUser(p.user) })));
    } catch (error) {
        console.error("Error getting user products:", error);
        res.status(500).json({ error: "Failed to get user products" });
    }
};

// Get single product by id (public)
export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!isValidUUID(id)) return res.status(400).json({ error: "Invalid product id" });
        const product = await queries.getProductById(id);
        
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.status(200).json({
    ...product,
    user: safeUser(product.user),
    comments: product.comments?.map(c => ({ ...c, user: safeUser(c.user) })) ?? [],
});
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({ error: "Failed to get product" });
    }
};

// Create product (protected)
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { title, description, imageUrl } = req.body;
        if (!title || !description || !imageUrl) {
            return res.status(400).json({ error: "Title, description and imageUrl are required" });
        }

        const product = await queries.createProduct({ 
            title, 
            description, 
            imageUrl, 
            userId 
        });
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

// Update product (protected - owner only)
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!isValidUUID(id)) return res.status(400).json({ error: "Invalid product id" });
        const { title, description, imageUrl } = req.body;

        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) return res.status(404).json({ error: "Product not found" });

        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: "You can only update your own products" });
        }
       
        const updatedProduct = await queries.updateProduct(id, { 
            title,
            description,
            imageUrl
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

// Delete product (protected - owner only)
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!isValidUUID(id)) return res.status(400).json({ error: "Invalid product id" });

        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) return res.status(404).json({ error: "Product not found" });

        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: "You can only delete your own products" });
        }

        await queries.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};