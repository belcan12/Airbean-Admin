import { Router } from "express";
import {
  getAllMenuItems,
  getMenuItem,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from "../services/menu.js";
import { authorizeAdmin } from "../middlewares/admin.js";

const router = Router();


router.get("/", async (req, res, next) => {
  const menu = await getAllMenuItems();
  if (menu) {
    res.json({
      success: true,
      menu
    });
  } else {
    next({
      status: 404,
      message: "Inga menyprodukter hittades"
    });
  }
});


router.post("/", authorizeAdmin, async (req, res, next) => {
  try {
    const { title, desc, price } = req.body;
    
    if (!title || !desc || price === undefined) {
      return next({
        status: 400,
        message: "Fälten title, desc och price är obligatoriska"
      });
    }

    const newItem = await addMenuItem({ title, desc, price });
    if (!newItem) {
      return next({
        status: 500,
        message: "Misslyckades med att lägga till ny menyprodukt"
      });
    }

    res.status(201).json({
      success: true,
      menuItem: newItem
    });
  } catch (error) {
    next(error);
  }
});


router.put("/:prodId", authorizeAdmin, async (req, res, next) => {
  try {
    const prodId = req.params.prodId;
    const { title, desc, price } = req.body;

    
    if (!title || !desc || price === undefined) {
      return next({
        status: 400,
        message: "Du måste skicka title, desc och price vid uppdatering"
      });
    }

    
    const existing = await getMenuItem(prodId);
    if (!existing) {
      return next({
        status: 404,
        message: `Ingen produkt hittades med prodId "${prodId}"`
      });
    }

    const updated = await updateMenuItem(prodId, { title, desc, price });
    if (!updated) {
      return next({
        status: 500,
        message: "Kunde inte uppdatera produkten"
      });
    }

    res.json({
      success: true,
      updatedItem: updated
    });
  } catch (error) {
    next(error);
  }
});


router.delete("/:prodId", authorizeAdmin, async (req, res, next) => {
  try {
    const prodId = req.params.prodId;

    
    const existing = await getMenuItem(prodId);
    if (!existing) {
      return next({
        status: 404,
        message: `Ingen produkt hittades med prodId "${prodId}" för att ta bort`
      });
    }

    const deleted = await deleteMenuItem(prodId);
    if (!deleted) {
      return next({
        status: 500,
        message: "Kunde inte ta bort produkten"
      });
    }

    res.json({
      success: true,
      message: `Produkten med prodId "${prodId}" togs bort`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
