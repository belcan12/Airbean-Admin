import Menu from "../models/menu.js";
import { v4 as uuid } from "uuid";


export async function getAllMenuItems() {
  try {
    return await Menu.find();
  } catch (error) {
    console.log(error.message);
    return null;
  }
}


export async function getMenuItem(prodId) {
  try {
    return await Menu.findOne({ prodId });
  } catch (error) {
    console.log(error.message);
    return null;
  }
}


export async function addMenuItem({ title, desc, price }) {
  try {
    
    const newProdId = `prod-${uuid().substring(0, 5)}`;

    const newItem = await Menu.create({
      prodId: newProdId,
      title,
      desc,
      price
      
    });

    return newItem;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}


export async function updateMenuItem(prodId, { title, desc, price }) {
  try {
    
    const updated = await Menu.findOneAndUpdate(
      { prodId },
      { title, desc, price },
      { new: true }
    );
    return updated; 
  } catch (error) {
    console.log(error.message);
    return null;
  }
}


export async function deleteMenuItem(prodId) {
  try {
    const deleted = await Menu.findOneAndDelete({ prodId });
    return deleted; 
  } catch (error) {
    console.log(error.message);
    return null;
  }
}
